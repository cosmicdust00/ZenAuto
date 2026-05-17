const { pool } = require('../config/supabase');

// PROTECTED
// Harus selalu mereturn object user yang valid agar UI tidak White Screen
exports.getProfile = async (req, res) => {
    try {
        const userId = req.user?.userId;
        
        if (!userId) {
            return res.status(401).json({ message: "Otentikasi gagal: Token tidak ditemukan atau tidak sah." });
        }

        // Ambil data user, KECUALI password_hash demi keamanan
        const query = `
            SELECT user_id, full_name, email, phone_number, id_card_number, license_card_number, bank_account, created_at
            FROM "user"
            WHERE user_id = $1
        `;
        const result = await pool.query(query, [userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Pengguna tidak ditemukan di database." });
        }

        res.status(200).json({
            message: "Berhasil mengambil profil pengguna.",
            data: result.rows[0]
        });

    } catch (error) {
        console.error("Error in getProfile:", error.message);
        res.status(500).json({ message: "Terjadi kesalahan internal server saat mengambil profil." });
    }
};

// PROTECTED
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user?.userId;
        
        if (!userId) {
            return res.status(401).json({ message: "Otentikasi gagal: Token tidak ditemukan atau tidak sah." });
        }

        const { license_card_number, bank_account } = req.body;

        // Menggunakan COALESCE agar jika salah satu field tidak dikirim frontend, data lamanya tidak terhapus
        const query = `
            UPDATE "user"
            SET 
                license_card_number = COALESCE($1, license_card_number),
                bank_account = COALESCE($2, bank_account)
            WHERE user_id = $3
            RETURNING user_id, full_name, email, license_card_number, bank_account;
        `;
        
        // Nilai dikonversi ke null jika string kosong agar sesuai dengan struktur database
        const values = [
            license_card_number ? license_card_number : null, 
            bank_account ? bank_account : null, 
            userId
        ];

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Pengguna tidak ditemukan." });
        }

        res.status(200).json({
            message: "Profil berhasil diperbarui.",
            data: result.rows[0]
        });

    } catch (error) {
        console.error("Error in updateProfile:", error.message);
        
        // Tangkap error jika ada user lain yang sudah pakai nomor SIM yang sama (UNIQUE constraint)
        if (error.code === '23505') {
            return res.status(400).json({ 
                message: "Failed to update profile: license, id card, or phone number is already registered." 
            });
        }
        
        res.status(500).json({ message: "Terjadi kesalahan saat memperbarui profil." });
    }
};