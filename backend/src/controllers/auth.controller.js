const { pool } = require("../config/supabase");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

const SALT_ROUNDS = 10;

exports.register = async (req, res, next) => {
    const { full_name, email, password_hash, phone_number, id_card_number } =
        req.body;

    const { rows } = await pool.query(
        "SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)",
        [email],
    );

    if (rows[0].exists) {
        return res.status(400).json({
            message: "User dengan email yang sama sudah ada",
        });
    }

    password_hash = await bcrypt.hash(password_hash, SALT_ROUNDS);

    await pool.query(
        `
            INSERT INTO users (full_name, email, password_hash, phone_number, id_card_number)
            VALUES ($1, $2, $3, $4, $5);
        `,
        [full_name, email, password_hash, phone_number, id_card_number],
    );

    res.status(201).json({
        message: "success",
    });
};

exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    const { rows } = await pool.query(
        `
            SELECT * FROM users
            WHERE email = $1;
        `,
        [email]
    );

    if (!rows[0].exists) {
        return res.status(404).json({
            message: "User tidak ditemukan",
        })
    }

    const user = rows[0]

    const isNotMatch = await bcrypt.compare(password, user.password_hash);

    if (isNotMatch) {
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

    res.status(200).json({
        token,
        user,
    })
};
