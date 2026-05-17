const mongoose = require('mongoose');

const telemetrySchema = new mongoose.Schema({
    car_id: { 
        type: String, 
        required: true, 
        index: true // Di-index agar pencarian berdasarkan mobil sangat cepat
    },
    gps_device_id: { 
        type: String, 
        required: true 
    },
    bucket_start: { 
        type: Date, 
        required: true 
    },
    bucket_end: { 
        type: Date, 
        required: true 
    },
    count: { 
        type: Number, 
        default: 0,
        max: 60 // Misalnya kita batasi 1 bucket maksimal 60 data point (1 data per menit)
    },
    measurements: [{
        timestamp: { type: Date, required: true },
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true }
    }]
});

module.exports = mongoose.model('VehicleTelemetry', telemetrySchema, 'vehicle_telemetry');