const { pool } = require("../config/supabase");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

const SALT_ROUNDS = 10;

exports.register = async (req, res, next) => {
    try {
        const { full_name, email, password_hash, phone_number, id_card_number } = req.body;

        const nameRegex = /^[a-zA-Z\s]{3,100}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        const phoneRegex = /^(^\+62|62|^08)(\d{3,4}-?){2}\d{3,4}$/;
        const idCardRegex = /^\d{16}$/;

        if (!nameRegex.test(full_name)) return res.status(400).json({ message: "Format nama tidak valid." });
        if (!emailRegex.test(email)) return res.status(400).json({ message: "Format email tidak valid." });
        if (!passwordRegex.test(password_hash)) return res.status(400).json({ message: "Format kata sandi tidak memenuhi syarat keamanan." });
        if (!phoneRegex.test(phone_number)) return res.status(400).json({ message: "Format nomor telepon tidak valid." });
        if (!idCardRegex.test(id_card_number)) return res.status(400).json({ message: "Nomor KTP harus 16 digit angka." });

        if (!password_hash) {
            return res.status(400).json({
                message: "Password tidak boleh kosong"
            });
        }

        const { rows } = await pool.query(
            'SELECT EXISTS(SELECT 1 FROM "user" WHERE email = $1)',
            [email]
        );

        if (rows[0].exists) {
            return res.status(400).json({
                message: "User dengan email yang sama sudah ada",
            });
        }

        const hashedPassword = await bcrypt.hash(password_hash, 10);

        await pool.query(
            `
                INSERT INTO "user" (full_name, email, password_hash, phone_number, id_card_number)
                VALUES ($1, $2, $3, $4, $5);
            `,
            [full_name, email, hashedPassword, phone_number, id_card_number]
        );

        res.status(201).json({
            message: "success",
        });
    } catch (error) {
        console.error("Registration Error:", error);
        next(error); 
    }
};

exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    const { rows } = await pool.query(
        `
            SELECT * FROM "user"
            WHERE email = $1;
        `,
        [email]
    );

    if (rows.length === 0) {
    return res.status(404).json({
        message: "User tidak ditemukan",
    });
    }

    const user = rows[0]

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
        return res.status(400).json({
            message: "Password salah",
        })
    }

    const jwtPayload = {
        userId: user.user_id,
    }

    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, {
        expiresIn: "24h"
    })

    delete user.password_hash;

    res.status(200).json({
        token,
        user,
    })
};
