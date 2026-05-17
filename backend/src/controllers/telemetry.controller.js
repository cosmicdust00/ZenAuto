const VehicleTelemetry = require('../models/telemetry.model');
const { pool } = require('../config/supabase'); 

// PUBLIC ENDPOINT
// Menyimpan koordinat GPS ke MongoDB
exports.saveLocation = async (req, res) => {
    try {
        const { car_id, latitude, longitude, timestamp } = req.body;

        if (!car_id || latitude === undefined || longitude === undefined) {
            return res.status(400).json({ message: "Required fields (car_id, latitude, longitude) are missing!" });
        }

        const checkQuery = `
            SELECT car_id, status, gps_device_id 
            FROM fleet_cars 
            WHERE car_id = $1
        `;
        const checkResult = await pool.query(checkQuery, [car_id]);

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ message: "Unregistered vehicle UUID." });
        }

        const car = checkResult.rows[0];
        if (car.status !== 'rented') {
            return res.status(202).json({ message: "Location ping ignored. Car is not currently rented." });
        }

        const currentTime = timestamp ? new Date(timestamp) : new Date();
        const bucketStart = new Date(currentTime);
        bucketStart.setMinutes(0, 0, 0); 
        
        const bucketEnd = new Date(bucketStart);
        bucketEnd.setHours(bucketStart.getHours() + 1); 

        await VehicleTelemetry.findOneAndUpdate(
            {
                car_id: car.car_id,
                bucket_start: bucketStart,
                count: { $lt: 60 } 
            },
            {
                $push: {
                    measurements: {
                        timestamp: currentTime,
                        latitude: latitude,
                        longitude: longitude
                    }
                },
                $inc: { count: 1 },
                $setOnInsert: {
                    gps_device_id: car.gps_device_id || 'UNKNOWN-GPS', 
                    bucket_end: bucketEnd
                }
            },
            { upsert: true, new: true }
        );

        res.status(201).json({ message: "Telemetry data successfully recorded." });

    } catch (error) {
        console.error("Error in saveLocation:", error);
        res.status(500).json({ message: "Internal server error during telemetry recording." });
    }
};

// PROTECTED ENDPOINT
// Mengambil lokasi terbaru untuk ditampilkan di peta leaflet
exports.getLatestLocation = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: "Otentikasi gagal: Token tidak ditemukan atau tidak sah." });
        }

        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        const { car_id } = req.params;

        const accessCheckQuery = `
            SELECT EXISTS (
                SELECT 1 FROM fleet_cars WHERE car_id = $1 AND user_id = $2
                UNION
                SELECT 1 FROM rental_transactions rt
                JOIN rental_details rd ON rt.transaction_id = rd.transaction_id
                WHERE rd.car_id = $1 AND rt.user_id = $2 AND rt.transaction_status = 'active'
            ) as "hasAccess";
        `;
        const accessResult = await pool.query(accessCheckQuery, [car_id, userId]);

        if (!accessResult.rows[0].hasAccess) {
            return res.status(403).json({ message: "Akses ditolak: Anda tidak memiliki wewenang untuk melacak kendaraan ini!" });
        }

        const latestBucket = await VehicleTelemetry.findOne({ car_id: car_id })
            .sort({ bucket_start: -1, _id: -1 }); 

        if (!latestBucket || latestBucket.measurements.length === 0) {
            return res.status(404).json({ message: "No telemetry data found for this car." });
        }

        const latestMeasurement = latestBucket.measurements[latestBucket.measurements.length - 1];

        res.status(200).json({
            message: "Successfully retrieved latest location.",
            data: {
                car_id: latestBucket.car_id,
                gps_device_id: latestBucket.gps_device_id,
                timestamp: latestMeasurement.timestamp,
                latitude: latestMeasurement.latitude,
                longitude: latestMeasurement.longitude
            }
        });

    } catch (error) {
        console.error("Error in getLatestLocation:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

// PROTECTED ENDPOINT
// GET /api/telemetry/history/:car_id
exports.getTrajectoryHistory = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: "Otentikasi gagal: Token tidak ditemukan atau tidak sah." });
        }

        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        
        const { car_id } = req.params;
        const { start, end } = req.query;

        if (!start || !end) {
            return res.status(400).json({ message: "Start and End parameters are required." });
        }

        const accessCheckQuery = `
            SELECT EXISTS (
                SELECT 1 FROM fleet_cars WHERE car_id = $1 AND user_id = $2
                UNION
                SELECT 1 FROM rental_transactions rt
                JOIN rental_details rd ON rt.transaction_id = rd.transaction_id
                WHERE rd.car_id = $1 AND rt.user_id = $2 AND rt.transaction_status = 'active'
            ) as "hasAccess";
        `;
        const accessResult = await pool.query(accessCheckQuery, [car_id, userId]);

        if (!accessResult.rows[0].hasAccess) {
            return res.status(403).json({ message: "Akses ditolak: Anda tidak memiliki wewenang untuk melihat riwayat perjalanan kendaraan ini!" });
        }

        const startDate = new Date(start);
        const endDate = new Date(end);

        const buckets = await VehicleTelemetry.find({
            car_id: car_id,
            bucket_start: { $lte: endDate },
            bucket_end: { $gte: startDate }
        }).sort({ bucket_start: 1, _id: 1 });

        let trajectoryPath = [];
        
        buckets.forEach(bucket => {
            bucket.measurements.forEach(m => {
                trajectoryPath.push([m.latitude, m.longitude]);
            });
        });

        res.status(200).json({
            message: "Successfully compiled historical trajectory path.",
            data: trajectoryPath
        });

    } catch (error) {
        console.error("Error in getTrajectoryHistory:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};