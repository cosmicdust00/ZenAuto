const { supabase } = require('../config/supabase');

exports.uploadCarImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Please upload the image" });
        }

        const file = req.file;

        const fileExtension = file.originalname.split('.').pop();
        const fileName = `car-${Date.now()}.${fileExtension}`;

        const { data, error } = await supabase.storage
            .from('cars')
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
            });

        if (error) throw error;

        const { data: urlData } = supabase.storage
            .from('cars')
            .getPublicUrl(fileName);

        res.status(200).json({
            message: "Upload success!",
            imageUrl: urlData.publicUrl
        });

    } catch (error) {
        console.error("Fail to upload:", error.message);
        res.status(500).json({ message: "There is server problem when uploading image." });
    }
};