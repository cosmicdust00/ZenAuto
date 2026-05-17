const { pool } = require('../config/supabase');

// Butuh token rute, tapi tidak butuh otorisasi kepemilikan khusus
// Mengambil model mobil untuk dropdown pendaftaran
exports.getCarModels = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: "Otentikasi gagal: Token tidak ditemukan atau tidak sah." });
        }

        const result = await pool.query('SELECT * FROM car_models ORDER BY brand ASC, model_name ASC');
        res.status(200).json({
            message: "Successfully retrieved car models.",
            data: result.rows
        });
    } catch (error) {
        console.error("Error in getCarModels:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

// Menambahkan mobil yang dapat disewa
exports.addFleetCar = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: "Otentikasi gagal: Token tidak ditemukan atau tidak sah." });
        }

        const { model_id, license_plate, color, image_url, gps_device_id } = req.body;

        if (!model_id || !license_plate || !color) {
            return res.status(400).json({ message: "Required fields (model_id, license_plate, color) are missing!" });
        }

        const query = `
            INSERT INTO fleet_cars (model_id, user_id, license_plate, color, status, image_url, gps_device_id)
            VALUES ($1, $2, $3, $4, 'available', $5, $6)
            RETURNING *;
        `;
        
        const values = [model_id, userId, license_plate, color, image_url, gps_device_id || null];
        const result = await pool.query(query, values);

        res.status(201).json({
            message: "Car successfully added to the fleet!",
            data: result.rows[0]
        });

    } catch (error) {
        console.error("Error occurred in addFleetCar:", error.message);
        if (error.message.includes('invalid input syntax for type uuid')) {
            return res.status(400).json({ message: "Invalid ID format! Please ensure you are using a valid UUID string." });
        }
        if (error.code === '23503') {
            return res.status(404).json({ message: "Failed to add car! The specified car model or user record was not found." });
        }
        if (error.code === '23505') {
            return res.status(400).json({ message: "The license plate or GPS Device ID is already registered in the system!" });
        }
        res.status(500).json({ message: "Internal server error." });
    }
};

// Menarik mobil dari peredaran
exports.withdrawFleetCar = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: "Otentikasi gagal: Token tidak ditemukan atau tidak sah." });
        }

        const { car_id } = req.params;

        const checkQuery = 'SELECT status, user_id FROM fleet_cars WHERE car_id = $1';
        const checkResult = await pool.query(checkQuery, [car_id]);

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ message: "Car not found." });
        }

        if (checkResult.rows[0].user_id !== userId) {
            return res.status(403).json({ message: "Akses ditolak: Anda tidak berhak menarik mobil milik orang lain!" });
        }

        if (checkResult.rows[0].status === 'rented') {
            return res.status(400).json({ message: "Cannot withdraw a car that is currently rented by a borrower!" });
        }

        const updateQuery = `
            UPDATE fleet_cars 
            SET status = 'withdrawn' 
            WHERE car_id = $1 
            RETURNING *;
        `;
        const result = await pool.query(updateQuery, [car_id]);

        res.status(200).json({
            message: "Car successfully withdrawn from the fleet.",
            data: result.rows[0]
        });

    } catch (error) {
        console.error("Error in withdrawFleetCar:", error.message);
        res.status(500).json({ message: "Internal server error." });
    }
};

exports.startMaintenance = async (req, res) => {
    const client = await pool.connect();
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: "Otentikasi gagal: Token tidak ditemukan atau tidak sah." });
        }

        const { car_id, description } = req.body;

        if (!car_id || !description) {
            return res.status(400).json({ message: "Required fields (car_id, description) are missing" });
        }

        await client.query('BEGIN');

        const checkQuery = 'SELECT status, user_id FROM fleet_cars WHERE car_id = $1';
        const checkResult = await client.query(checkQuery, [car_id]);

        if (checkResult.rows.length === 0) throw new Error('CAR_NOT_FOUND');
        
        if (checkResult.rows[0].user_id !== userId) throw new Error('NOT_YOUR_CAR');
        if (checkResult.rows[0].status !== 'available') throw new Error('CAR_NOT_AVAILABLE');

        const maintQuery = `
            INSERT INTO maintenance_list (car_id, start_date, description, status, cost)
            VALUES ($1, NOW(), $2, 'in progress', 0)
            RETURNING maintenance_id;
        `;
        const maintResult = await client.query(maintQuery, [car_id, description]);

        const updateCarQuery = "UPDATE fleet_cars SET status = 'maintenance' WHERE car_id = $1";
        await client.query(updateCarQuery, [car_id]);

        await client.query('COMMIT');

        res.status(201).json({
            message: "Car has been sent to maintenance.",
            data: { maintenance_id: maintResult.rows[0].maintenance_id }
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Error in startMaintenance:", error.message);
        if (error.message === 'NOT_YOUR_CAR') return res.status(403).json({ message: "Akses ditolak: Anda bukan pemilik mobil ini!" });
        if (error.message === 'CAR_NOT_FOUND') return res.status(404).json({ message: "Car not found." });
        if (error.message === 'CAR_NOT_AVAILABLE') return res.status(400).json({ message: "Car must be 'available' to send to maintenance." });
        res.status(500).json({ message: "Internal server error." });
    } finally {
        client.release();
    }
};

exports.completeMaintenance = async (req, res) => {
    const client = await pool.connect();
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: "Otentikasi gagal: Token tidak ditemukan atau tidak sah." });
        }

        const { maintenance_id } = req.params;
        const { cost } = req.body;

        if (cost === undefined) {
            return res.status(400).json({ message: "Maintenance cost is required" });
        }

        await client.query('BEGIN');

        const checkQuery = `
            SELECT ml.car_id, ml.status, f.user_id 
            FROM maintenance_list ml
            JOIN fleet_cars f ON ml.car_id = f.car_id
            WHERE ml.maintenance_id = $1
        `;
        const checkResult = await client.query(checkQuery, [maintenance_id]);

        if (checkResult.rows.length === 0) throw new Error('MAINT_NOT_FOUND');
        
        if (checkResult.rows[0].user_id !== userId) throw new Error('NOT_YOUR_ASSET');
        if (checkResult.rows[0].status === 'completed') throw new Error('ALREADY_COMPLETED');

        const carId = checkResult.rows[0].car_id;

        const updateMaintQuery = `
            UPDATE maintenance_list 
            SET end_date = NOW(), cost = $1, status = 'completed'
            WHERE maintenance_id = $2;
        `;
        await client.query(updateMaintQuery, [cost, maintenance_id]);

        const updateCarQuery = "UPDATE fleet_cars SET status = 'available' WHERE car_id = $1";
        await client.query(updateCarQuery, [carId]);

        await client.query('COMMIT');

        res.status(200).json({ message: "Maintenance completed. Car is available again." });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Error in completeMaintenance:", error.message);
        if (error.message === 'NOT_YOUR_ASSET') return res.status(403).json({ message: "Akses ditolak: Anda bukan pemilik aset perawatan ini!" });
        if (error.message === 'MAINT_NOT_FOUND') return res.status(404).json({ message: "Maintenance record not found." });
        if (error.message === 'ALREADY_COMPLETED') return res.status(400).json({ message: "This maintenance is already completed." });
        res.status(500).json({ message: "Internal server error." });
    } finally {
        client.release();
    }
};

exports.getLenderFleets = async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: Missing user authentication context." });
        }

        const query = `
            SELECT 
                f.car_id, f.license_plate, f.color, f.status, f.image_url, f.gps_device_id,
                m.brand, m.model_name, m.base_daily_price
            FROM fleet_cars f
            JOIN car_models m ON f.model_id = m.model_id
            WHERE f.user_id = $1
            ORDER BY f.status ASC, m.brand ASC;
        `;
        
        const result = await pool.query(query, [userId]);
        res.status(200).json({ message: "Successfully retrieved fleet list.", data: result.rows });

    } catch (error) {
        console.error("Error in getLenderFleets:", error.message);
        res.status(500).json({ message: "Internal server error." });
    }
};

exports.getLenderDashboard = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: Missing user authentication context." });
        }

        const statsQuery = `
            SELECT 
                COUNT(*) as total_fleet,
                COUNT(CASE WHEN status = 'rented' THEN 1 END) as active_rentals,
                COUNT(CASE WHEN status = 'maintenance' THEN 1 END) as in_maintenance
            FROM fleet_cars WHERE user_id = $1;
        `;
        const statsResult = await pool.query(statsQuery, [userId]);
        const stats = statsResult.rows[0];

        const revenueQuery = `
            SELECT COALESCE(SUM(p.amount), 0) as total_revenue
            FROM payments p
            JOIN rental_details rd ON p.transaction_id = rd.transaction_id
            JOIN fleet_cars f ON rd.car_id = f.car_id
            WHERE f.user_id = $1 AND p.payment_status = 'success';
        `;
        const revenueResult = await pool.query(revenueQuery, [userId]);
        const totalRevenue = revenueResult.rows[0].total_revenue;

        const recentQuery = `
            SELECT p.amount, p.payment_date, f.license_plate, m.model_name
            FROM payments p
            JOIN rental_details rd ON p.transaction_id = rd.transaction_id
            JOIN fleet_cars f ON rd.car_id = f.car_id
            JOIN car_models m ON f.model_id = m.model_id
            WHERE f.user_id = $1 AND p.payment_status = 'success'
            ORDER BY p.payment_date DESC LIMIT 3;
        `;
        const recentResult = await pool.query(recentQuery, [userId]);

        res.status(200).json({
            message: "Successfully retrieved dashboard data.",
            data: {
                stats: {
                    total_fleet: parseInt(stats.total_fleet),
                    active_rentals: parseInt(stats.active_rentals),
                    in_maintenance: parseInt(stats.in_maintenance),
                    total_revenue: parseFloat(totalRevenue)
                },
                recent_finances: recentResult.rows
            }
        });

    } catch (error) {
        console.error("Error in getLenderDashboard:", error.message);
        res.status(500).json({ message: "Internal server error." });
    }
};

exports.getLenderMaintenance = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ message: "Unauthorized: Missing user authentication context." });

        const query = `
            SELECT ml.maintenance_id, ml.start_date, ml.end_date, ml.cost, ml.description, ml.status, f.license_plate, m.model_name
            FROM maintenance_list ml
            JOIN fleet_cars f ON ml.car_id = f.car_id
            JOIN car_models m ON f.model_id = m.model_id
            WHERE f.user_id = $1 ORDER BY ml.start_date DESC;
        `;
        const result = await pool.query(query, [userId]);
        res.status(200).json({ message: "Successfully retrieved maintenance records.", data: result.rows });
    } catch (error) {
        console.error("Error in getLenderMaintenance:", error.message);
        res.status(500).json({ message: "Internal server error." });
    }
};

exports.getLenderFinances = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ message: "Unauthorized: Missing user authentication context." });

        const earningsQuery = `
            SELECT p.payment_id, p.amount, p.payment_date, p.payment_method, f.license_plate, m.model_name
            FROM payments p
            JOIN rental_transactions rt ON p.transaction_id = rt.transaction_id
            JOIN rental_details rd ON rt.transaction_id = rd.transaction_id
            JOIN fleet_cars f ON rd.car_id = f.car_id
            JOIN car_models m ON f.model_id = m.model_id
            WHERE f.user_id = $1 AND p.payment_status = 'success'
            ORDER BY p.payment_date DESC;
        `;
        const earningsResult = await pool.query(earningsQuery, [userId]);

        const penaltiesQuery = `
            SELECT pn.penalty_id, pn.penalty_type, pn.amount, pn.description, pn.is_paid, rd.actual_return_date, f.license_plate
            FROM penalties pn
            JOIN rental_details rd ON pn.rental_detail_id = rd.rental_detail_id
            JOIN fleet_cars f ON rd.car_id = f.car_id
            WHERE f.user_id = $1 ORDER BY rd.actual_return_date DESC;
        `;
        const penaltiesResult = await pool.query(penaltiesQuery, [userId]);

        res.status(200).json({
            message: "Successfully retrieved financial records.",
            data: { earnings: earningsResult.rows, penalties: penaltiesResult.rows }
        });
    } catch (error) {
        console.error("Error in getLenderFinances:", error.message);
        res.status(500).json({ message: "Internal server error." });
    }
};

exports.getLenderPenalties = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ message: "User ID is required!" });

        const query = `
            SELECT pn.penalty_id, pn.penalty_type, pn.amount, pn.description, pn.is_paid, rd.actual_return_date, f.license_plate, m.model_name
            FROM penalties pn
            JOIN rental_details rd ON pn.rental_detail_id = rd.rental_detail_id
            JOIN fleet_cars f ON rd.car_id = f.car_id
            JOIN car_models m ON f.model_id = m.model_id
            WHERE f.user_id = $1 ORDER BY rd.actual_return_date DESC;
        `;
        const result = await pool.query(query, [userId]);
        res.status(200).json({ message: "Successfully retrieved penalty records.", data: result.rows });
    } catch (error) {
        console.error("Error in getLenderPenalties:", error.message);
        res.status(500).json({ message: "Internal server error." });
    }
};