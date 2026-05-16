const VehicleTelemetry = require('../models/telemetry.model');
const { pool } = require('../config/supabase'); // PG untuk cek status mobil

// Menyimpan koordinat GPS ke MongoDB (Bucket Pattern)
exports.saveLocation = async (req, res) => {
    try {
        const { gps_device_id, latitude, longitude, timestamp } = req.body;

        if (!gps_device_id || latitude === undefined || longitude === undefined) {
            return res.status(400).json({ message: "Required fields (gps_device_id, latitude, longitude) are missing!" });
        }

        const checkQuery = `
            SELECT car_id, status 
            FROM fleet_cars 
            WHERE gps_device_id = $1
        `;
        const checkResult = await pool.query(checkQuery, [gps_device_id]);

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ message: "Unregistered GPS device." });
        }

        const car = checkResult.rows[0];
        if (car.status !== 'rented') {
            return res.status(202).json({ message: "Location ping ignored. Car is not currently rented." });
        }

        // Jika alat GPS tidak mengirim waktu, gunakan waktu server saat ini
        const currentTime = timestamp ? new Date(timestamp) : new Date();
        
        // Buat 1 bucket (ember) per jam.
        // Contoh: Jika sekarang jam 14:23:45, embernya bernama "14:00:00"
        const bucketStart = new Date(currentTime);
        bucketStart.setMinutes(0, 0, 0); 
        
        const bucketEnd = new Date(bucketStart);
        bucketEnd.setHours(bucketStart.getHours() + 1); // Batas akhir ember: "15:00:00"

        // 3. Masukkan ke MongoDB menggunakan metode upsert (update or insert)
        await VehicleTelemetry.findOneAndUpdate(
            {
                car_id: car.car_id,
                bucket_start: bucketStart,
                count: { $lt: 60 } // Cari ember jam ini yang isinya belum mencapai 60 titik
            },
            {
                // Push data baru ke dalam array measurements
                $push: {
                    measurements: {
                        timestamp: currentTime,
                        latitude: latitude,
                        longitude: longitude
                    }
                },
                // Tambah nilai count sebanyak +1
                $inc: { count: 1 },
                // Set data dasar hanya jika ember baru terbuat
                $setOnInsert: {
                    gps_device_id: gps_device_id,
                    bucket_end: bucketEnd
                }
            },
            { 
                upsert: true, // Jika ember belum ada, buat baru
                new: true 
            }
        );

        res.status(201).json({ message: "Telemetry data successfully recorded." });

    } catch (error) {
        console.error("Error in saveLocation:", error);
        res.status(500).json({ message: "Internal server error during telemetry recording." });
    }
};

// Mengambil lokasi terbaru untuk ditampilkan di peta leaflet
exports.getLatestLocation = async (req, res) => {
    try {
        const { car_id } = req.params;

        // Cari bucket terbaru untuk mobil ini (urutkan berdasarkan waktu turun)
        const latestBucket = await VehicleTelemetry.findOne({ car_id: car_id })
            .sort({ bucket_start: -1 });

        if (!latestBucket || latestBucket.measurements.length === 0) {
            return res.status(404).json({ message: "No telemetry data found for this car." });
        }

        // Karena data di dalam array measurements selalu bertambah ke bawah (push),
        // Lokasi terbarunya adalah elemen paling terakhir di dalam array tersebut.
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