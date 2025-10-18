// src/routes/fileRoutes.js
const express = require('express');
const upload = require('../middleware/uploadMiddleware'); // Import middleware Multer
const router = express.Router();

// Hàm xử lý logic chính sau khi file được upload
const processFileHandler = async (req, res) => {
    // req.file chứa thông tin file đã được xử lý bởi Multer

    if (!req.file) {
        return res.status(400).json({ success: false, message: 'Không tìm thấy file trong yêu cầu.' });
    }

    const fileInfo = {
        filename: req.file.filename,
        path: req.file.path,
        mimetype: req.file.mimetype,
        size: req.file.size
    };

    console.log("File đã nhận thành công:", fileInfo);

    // --- TODO: GỌI GEMINI API TẠI ĐÂY ---
    // Đọc file từ fileInfo.path và truyền nội dung tới Gemini

    // Phản hồi mẫu (Mock Response)
    const mockGeminiResult = {
        summary: "Đây là kết quả tóm tắt từ mô hình Gemini về tài liệu bạn gửi.",
        tokens: 50
    };

    // Xóa file tạm thời sau khi xử lý xong (Tùy chọn, nên làm để giải phóng dung lượng)
    // const fs = require('fs');
    // fs.unlinkSync(req.file.path); 

    return res.status(200).json({
        success: true,
        message: 'File đã được nhận và xử lý.',
        data: mockGeminiResult
    });
};


// Định nghĩa route POST /api/process-file
// Gắn middleware 'upload' trước hàm xử lý chính
router.post('/process-file', (req, res, next) => {
    // Bọc Multer trong một hàm xử lý lỗi
    upload(req, res, (err) => {
        if (err) {
            console.error("Upload Error:", err);
            // MulterError (vd: giới hạn kích thước) hoặc lỗi hệ thống khác
            return res.status(400).json({
                success: false,
                message: err.message || 'Lỗi upload file không xác định.'
            });
        }
        // Nếu không có lỗi, chuyển sang hàm xử lý logic chính
        processFileHandler(req, res);
    });
});

module.exports = router;