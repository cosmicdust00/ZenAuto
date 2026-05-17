const { pool } = require('../config/supabase');

// GET /api/faqs (Ambil yang statusnya approved)
exports.getApprovedFaqs = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM faqs WHERE status = 'approved' ORDER BY number_id ASC");
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching FAQs:", error.message);
        res.status(500).json({ message: "Error fetching FAQs" });
    }
};

// POST /api/faqs/inquiry (customer bertanya via chat bubble)
exports.submitInquiry = async (req, res) => {
    try {
        const { question } = req.body;

        // Validasi keberadaan dan tipe data (mencegah TypeError)
        if (!question || typeof question !== 'string' || question.trim() === '') {
            return res.status(400).json({ message: "Question is required and must be a valid text!" });
        }

        // Validasi panjang karakter
        if (question.length > 1000) {
            return res.status(400).json({ message: "Your question is too long! Maximum is 1000 characters." });
        }

        // Sanitasi untuk mencegah script HTML masuk
        const sanitizedQuestion = question.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        await pool.query(
            "INSERT INTO faqs (title, \"desc\", status) VALUES ('Inquiry', $1, 'pending')",
            [sanitizedQuestion]
        );
        res.status(201).json({ message: "Inquiry submitted successfully." });
    } catch (error) {
        console.error("Error submitting inquiry:", error.message);
        res.status(500).json({ message: "Error submitting inquiry" });
    }
};

// PUT /api/faqs/publish/:id (admin membalas dan publish)
// Hanya boleh dieksekusi oleh pengguna yang membawa Token JWT sah (Staff/Admin)
exports.publishFaq = async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ 
                message: "Otentikasi gagal: Anda harus masuk sistem untuk dapat mengelola konten FAQ." 
            });
        }

        const { id } = req.params;
        const { answer } = req.body;

        if (!answer || typeof answer !== 'string' || answer.trim() === '') {
            return res.status(400).json({ message: "Answer cannot be empty!" });
        }
        
        const result = await pool.query(
            "UPDATE faqs SET \"desc\" = $1, status = 'approved' WHERE id = $2",
            [answer, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "FAQ record not found!" });
        }

        res.status(200).json({ message: "FAQ successfully published." });
    } catch (error) {
        console.error("Error publishing FAQ:", error.message);

        if (error.code === '22P02') {
            return res.status(400).json({ message: "Invalid FAQ ID format." });
        }

        res.status(500).json({ message: "Error publishing FAQ" });
    }
};