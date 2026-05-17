const { pool } = require('../config/supabase');

// Mengambil mobil yang dapat disewa
exports.getAvailableCars = async (req, res) => {
    try {
        const { brand, transmission, location } = req.query; 

        let query = `
            SELECT 
                f.car_id as id,
                f.color,
                f.image_url as img,
                f.location,
                f.has_insurance as "hasInsurance",
                f.rating,
                f.reviews,
                m.brand,
                m.model_name as model,
                m.type,
                m.transmission,
                m.capacity as seats,
                m.base_daily_price as price,
                m.is_keyless as "isKeyless"
            FROM fleet_cars f
            JOIN car_models m ON f.model_id = m.model_id
            WHERE f.status = 'available'
        `;
        
        const values = [];
        let counter = 1;

        if (brand && brand !== 'All') {
            query += ` AND m.brand ILIKE $${counter}`;
            values.push(`%${brand}%`);
            counter++;
        }
        if (transmission && transmission !== 'All') {
            query += ` AND m.transmission = $${counter}`;
            values.push(transmission);
            counter++;
        }
        if (location && location !== 'All') {
            query += ` AND f.location ILIKE $${counter}`;
            values.push(`%${location}%`);
            counter++;
        }

        query += ` ORDER BY m.brand ASC, m.model_name ASC;`;

        const result = await pool.query(query, values);

        const formattedData = result.rows.map(car => ({
            ...car,
            price: parseFloat(car.price),
            rating: parseFloat(car.rating).toFixed(1),
            reviews: parseInt(car.reviews)
        }));

        res.status(200).json({ 
            message: "Successfully retrieved available cars.", 
            data: formattedData 
        });

    } catch (error) {
        console.error("Error in getAvailableCars:", error.message);
        res.status(500).json({ message: "Internal server error." });
    }
};

// Membuat atau melakukan sewa
// Membuat atau melakukan sewa
exports.createReservation = async (req, res) => {
    const client = await pool.connect(); 

    try {
        // Tangkap variabel baru dari frontend
        const { user_id, car_id, start_date, end_date, total_days, add_ons, base_price_per_day, grand_total_payment } = req.body;

        // Memastikan variabel harga baru divalidasi
        if (!user_id || !car_id || !start_date || !end_date || grand_total_payment === undefined || base_price_per_day === undefined) {
            return res.status(400).json({ message: "Required fields are missing!" });
        }

        // Validasi tanggal
        const startDateObj = new Date(start_date);
        const endDateObj = new Date(end_date);

        if (startDateObj >= endDateObj) {
            return res.status(400).json({ message: "End date must be strictly after start date!" });
        }
        if (startDateObj < new Date(new Date().setHours(0,0,0,0))) { // Memastikan tidak menyewa di hari yang sudah lewat
            return res.status(400).json({ message: "Cannot book a car in the past!" });
        }

        await client.query('BEGIN'); 

        // FOR UPDATE untuk mencegah race condition
        const carQuery = `SELECT status FROM fleet_cars WHERE car_id = $1 FOR UPDATE`;
        const carResult = await client.query(carQuery, [car_id]);

        if (carResult.rows.length === 0) throw new Error('CAR_NOT_FOUND');
        if (carResult.rows[0].status !== 'available') throw new Error('CAR_NOT_AVAILABLE');

        // Insert ke transaksi dengan grand_total_payment dan add_ons JSONB
        const txQuery = `
            INSERT INTO rental_transactions (user_id, booking_date, total_amount, transaction_status, add_ons)
            VALUES ($1, NOW(), $2, 'pending', $3)
            RETURNING transaction_id;
        `;
        // Pastikan add_ons dikonversi ke JSON string jika tidak otomatis terbaca
        const txResult = await client.query(txQuery, [user_id, grand_total_payment, JSON.stringify(add_ons || {})]);
        const transactionId = txResult.rows[0].transaction_id;

        // Insert ke rental details menggunakan base_price_per_day dari frontend
        const detailQuery = `
            INSERT INTO rental_details (transaction_id, car_id, start_date, end_date, price_per_day_at_booking)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        await client.query(detailQuery, [transactionId, car_id, start_date, end_date, base_price_per_day]);

        await client.query('COMMIT'); 

        res.status(201).json({
            message: "Reservation successfully created!",
            data: {
                transaction_id: transactionId,
                total_amount: grand_total_payment,
                status: 'pending'
            }
        });

    } catch (error) {
        // Rollback kalau error
        await client.query('ROLLBACK'); 
        console.error("Transaction Error:", error.message);
        
        if (error.message === 'CAR_NOT_FOUND') return res.status(404).json({ message: "Car not found." });
        if (error.message === 'CAR_NOT_AVAILABLE') return res.status(400).json({ message: "Car is currently not available for rent." });
        
        res.status(500).json({ message: "Internal server error during reservation." });
    } finally {
        client.release(); 
    }
};

// Memproses pembayaran
exports.processPayment = async (req, res) => {
    const client = await pool.connect();

    try {
        const { transaction_id, payment_method, amount } = req.body;

        if (!transaction_id || !payment_method || !amount) {
            return res.status(400).json({ message: "Required fields (transaction_id, payment_method, amount) are missing!" });
        }

        await client.query('BEGIN');

        const txQuery = 'SELECT total_amount, transaction_status FROM rental_transactions WHERE transaction_id = $1';
        const txResult = await client.query(txQuery, [transaction_id]);

        if (txResult.rows.length === 0) {
            throw new Error('TX_NOT_FOUND');
        }

        const transaction = txResult.rows[0];
        if (transaction.transaction_status !== 'pending') {
            throw new Error('NOT_PENDING');
        }

        if (parseFloat(amount) < parseFloat(transaction.total_amount)) {
            throw new Error('INSUFFICIENT_FUNDS');
        }

        const payQuery = `
            INSERT INTO payments (transaction_id, payment_method, amount, payment_date, payment_status)
            VALUES ($1, $2, $3, NOW(), 'success')
            RETURNING payment_id;
        `;
        await client.query(payQuery, [transaction_id, payment_method, amount]);

        const updateTxQuery = `
            UPDATE rental_transactions 
            SET transaction_status = 'active' 
            WHERE transaction_id = $1;
        `;
        await client.query(updateTxQuery, [transaction_id]);

        const detailQuery = 'SELECT car_id FROM rental_details WHERE transaction_id = $1';
        const detailResult = await client.query(detailQuery, [transaction_id]);
        const carId = detailResult.rows[0].car_id;

        const updateCarQuery = `
            UPDATE fleet_cars 
            SET status = 'rented' 
            WHERE car_id = $1;
        `;
        await client.query(updateCarQuery, [carId]);

        await client.query('COMMIT');

        res.status(200).json({
            message: "Payment successful! Car is now rented.",
            data: {
                transaction_id: transaction_id,
                status: "active"
            }
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Payment Transaction Error:", error.message);

        if (error.message === 'TX_NOT_FOUND') return res.status(404).json({ message: "Transaction not found." });
        if (error.message === 'NOT_PENDING') return res.status(400).json({ message: "Transaction is already paid or cancelled." });
        if (error.message === 'INSUFFICIENT_FUNDS') return res.status(400).json({ message: "Payment amount is less than the total bill." });

        res.status(500).json({ message: "Internal server error during payment processing." });
    } finally {
        client.release();
    }
}

// Pengembalian mobil
exports.returnCar = async (req, res) => {
    const client = await pool.connect();

    try {
        const { rental_detail_id } = req.params;

        if (!rental_detail_id) {
            return res.status(400).json({ message: "Rental detail ID is required!" });
        }

        await client.query('BEGIN');

        const detailQuery = `
            SELECT rd.transaction_id, rd.car_id, rd.end_date, rd.actual_return_date, rd.price_per_day_at_booking, rt.transaction_status
            FROM rental_details rd
            JOIN rental_transactions rt ON rd.transaction_id = rt.transaction_id
            WHERE rd.rental_detail_id = $1
        `;
        const detailResult = await client.query(detailQuery, [rental_detail_id]);

        if (detailResult.rows.length === 0) {
            throw new Error('RENTAL_NOT_FOUND');
        }

        const rental = detailResult.rows[0];

        if (rental.actual_return_date) {
            throw new Error('ALREADY_RETURNED');
        }

        if (rental.transaction_status !== 'active') {
            throw new Error('TRANSACTION_NOT_ACTIVE');
        }

        const updateDetailQuery = `
            UPDATE rental_details 
            SET actual_return_date = NOW() 
            WHERE rental_detail_id = $1;
        `;
        await client.query(updateDetailQuery, [rental_detail_id]);

        const actualReturnDate = new Date();
        const endDate = new Date(rental.end_date);
        
        let penaltyAmount = 0;
        let lateDays = 0;

        if (actualReturnDate > endDate) {
            const diffTime = Math.abs(actualReturnDate - endDate);
            lateDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Konversi miliseconds ke hitungan hari
            
            penaltyAmount = lateDays * rental.price_per_day_at_booking; // Perhitungan denda

            const penaltyQuery = `
                INSERT INTO penalties (rental_detail_id, penalty_type, amount, description, is_paid)
                VALUES ($1, 'late return', $2, $3, false);
            `;
            const description = `Automated late return penalty for ${lateDays} day(s).`;
            await client.query(penaltyQuery, [rental_detail_id, penaltyAmount, description]);
        }

        const updateTxQuery = `
            UPDATE rental_transactions 
            SET transaction_status = 'completed' 
            WHERE transaction_id = $1;
        `;
        await client.query(updateTxQuery, [rental.transaction_id]);

        const updateCarQuery = `
            UPDATE fleet_cars 
            SET status = 'available' 
            WHERE car_id = $1;
        `;
        await client.query(updateCarQuery, [rental.car_id]);

        await client.query('COMMIT');

        res.status(200).json({
            message: "Car successfully returned.",
            data: {
                rental_detail_id,
                is_late: penaltyAmount > 0,
                late_days: lateDays,
                penalty_amount: penaltyAmount,
                transaction_status: "completed"
            }
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Return Transaction Error:", error.message);

        if (error.message === 'RENTAL_NOT_FOUND') return res.status(404).json({ message: "Rental record not found." });
        if (error.message === 'ALREADY_RETURNED') return res.status(400).json({ message: "This car has already been returned." });
        if (error.message === 'TRANSACTION_NOT_ACTIVE') return res.status(400).json({ message: "This rental transaction is not currently active." });

        res.status(500).json({ message: "Internal server error during car return processing." });
    } finally {
        client.release();
    }
};

// Mengambil riwayat reservasi milik borrower
exports.getBorrowerReservations = async (req, res) => {
    try {
        // Untuk testing Postman saat ini, kita ambil dari req.query.user_id
        // Nanti saat digabung dengan kode backend1, ini harus diganti jadi req.user.user_id dari token JWT
        const userId = req.query.user_id; 

        if (!userId) {
            return res.status(400).json({ message: "User ID is required for testing!" });
        }

        const query = `
            SELECT 
                rt.transaction_id, 
                rt.booking_date, 
                rt.total_amount, 
                rt.transaction_status,
                rd.rental_detail_id,
                rd.start_date, 
                rd.end_date, 
                rd.actual_return_date,
                f.license_plate, 
                m.brand, 
                m.model_name
            FROM rental_transactions rt
            JOIN rental_details rd ON rt.transaction_id = rd.transaction_id
            JOIN fleet_cars f ON rd.car_id = f.car_id
            JOIN car_models m ON f.model_id = m.model_id
            WHERE rt.user_id = $1
            ORDER BY rt.booking_date DESC;
        `;
        
        const result = await pool.query(query, [userId]);

        res.status(200).json({
            message: "Successfully retrieved rental history.",
            data: result.rows
        });

    } catch (error) {
        console.error("Error in getBorrowerReservations:", error.message);
        res.status(500).json({ message: "Internal server error." });
    }
};

