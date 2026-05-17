const { createClient } = require("@supabase/supabase-js");
const { Pool } = require("pg");
require("dotenv").config();

const seed = `
    CREATE TYPE transmission_type AS ENUM ('manual', 'automatic');
    CREATE TYPE car_status AS ENUM ('available', 'rented', 'maintenance', 'withdrawn');
    CREATE TYPE transaction_status AS ENUM ('pending', 'confirmed', 'active', 'completed', 'cancelled');
    CREATE TYPE payment_status AS ENUM ('pending', 'success', 'failed', 'refunded');
    CREATE TYPE penalty_type AS ENUM ('late return', 'damage', 'others');
    CREATE TYPE maintenance_status AS ENUM ('scheduled', 'in progress', 'completed');

    CREATE TABLE "user" (
        user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(254) UNIQUE NOT NULL,
        password_hash VARCHAR(72) NOT NULL,
        phone_number VARCHAR(20) UNIQUE NOT NULL,
        id_card_number VARCHAR(16) UNIQUE NOT NULL,
        license_card_number VARCHAR(20) UNIQUE, 
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        bank_account VARCHAR(30)
    );

    CREATE TABLE car_models (
        model_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        brand VARCHAR(50) NOT NULL,
        model_name VARCHAR(50) UNIQUE NOT NULL,
        transmission transmission_type NOT NULL,
        capacity INT NOT NULL,
        base_daily_price DECIMAL(12, 2) NOT NULL,
        type VARCHAR(30) DEFAULT 'Standard',
        is_keyless BOOLEAN DEFAULT FALSE
    );

    CREATE TABLE fleet_cars (
        car_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        model_id UUID NOT NULL REFERENCES car_models(model_id),
        user_id UUID NOT NULL REFERENCES "user"(user_id),
        license_plate VARCHAR(15) UNIQUE NOT NULL,
        color VARCHAR(30) NOT NULL,
        status car_status NOT NULL,
        image_url VARCHAR(500),
        gps_device_id VARCHAR(50) UNIQUE,
        location VARCHAR(100) DEFAULT 'Jakarta Raya',
        has_insurance BOOLEAN DEFAULT TRUE,
        rating DECIMAL(2,1) DEFAULT 4.5,
        reviews INT DEFAULT 24
    );

    CREATE TABLE rental_transactions (
        transaction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES "user"(user_id),
        booking_date TIMESTAMPTZ NOT NULL,
        total_amount DECIMAL(12, 2) NOT NULL,
        transaction_status transaction_status NOT NULL,
        add_ons JSONB
    );

    CREATE TABLE rental_details (
        rental_detail_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        transaction_id UUID NOT NULL REFERENCES rental_transactions(transaction_id),
        car_id UUID NOT NULL REFERENCES fleet_cars(car_id),
        start_date TIMESTAMPTZ NOT NULL,
        end_date TIMESTAMPTZ NOT NULL,
        actual_return_date TIMESTAMPTZ,
        price_per_day_at_booking DECIMAL(12, 2) NOT NULL
    );

    CREATE TABLE payments (
        payment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        transaction_id UUID NOT NULL REFERENCES rental_transactions(transaction_id),
        payment_method VARCHAR(50) NOT NULL,
        amount DECIMAL(12, 2) NOT NULL,
        payment_date TIMESTAMPTZ NOT NULL,
        payment_status payment_status NOT NULL
    );

    CREATE TABLE penalties (
        penalty_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        rental_detail_id UUID NOT NULL REFERENCES rental_details(rental_detail_id),
        penalty_type penalty_type NOT NULL,
        amount DECIMAL(12, 2) NOT NULL,
        description VARCHAR(500) NOT NULL,
        is_paid BOOL NOT NULL DEFAULT FALSE
    );

    CREATE TABLE maintenance_list (
        maintenance_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        car_id UUID NOT NULL REFERENCES fleet_cars(car_id),
        start_date TIMESTAMPTZ NOT NULL,
        end_date TIMESTAMPTZ,
        cost DECIMAL(12, 2) NOT NULL,
        description VARCHAR(1000) NOT NULL,
        status maintenance_status NOT NULL
    );

    CREATE TABLE faqs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        number_id SERIAL,
        title VARCHAR(255) NOT NULL,
        "desc" VARCHAR(1000) NOT NULL, -- Dibatasi maksimal 1000 karakter
        status VARCHAR(20) DEFAULT 'pending'
    );
`

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY,
);

const pool = new Pool({
    connectionString: process.env.SUPABASE_DB_URL,
    ssl: { rejectUnauthorized: false },
});

pool.on("connect", () => {
    console.log("Terhubung ke Database PostgreSQL (Supabase)");
});

pool.on("error", (err) => {
    console.error("Error PostgreSQL:", err);
});

module.exports = { supabase, pool, seed };

