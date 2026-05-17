const { supabase } = require('../config/supabase');

exports.uploadCarImage = async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ 
                message: "Otentikasi gagal: Anda harus login terlebih dahulu untuk mengunggah berkas gambar." 
            });
        }

        // Validasi keberadaan berkas dari Multer middleware
        if (!req.file) {
            return res.status(400).json({ message: "Please upload the image" });
        }

        const file = req.file;

        const fileExtension = file.originalname.split('.').pop();
        const fileName = `car-${Date.now()}.${fileExtension}`;

        // Proses pengunggahan objek buffer file ke bucket 'cars' di Supabase
        const { data, error } = await supabase.storage
            .from('cars')
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
            });

        if (error) throw error;

        // Ambil URL publik dari berkas yang baru saja diunggah
        const { data: urlData } = supabase.storage
            .from('cars')
            .getPublicUrl(fileName);

        // Kirim respons sukses beserta tautan gambar untuk disimpan di database fleet oleh frontend
        res.status(200).json({
            message: "Upload success!",
            imageUrl: urlData.publicUrl
        });

    } catch (error) {
        console.error("Fail to upload:", error.message);
        res.status(500).json({ message: "There is server problem when uploading image." });
    }
};