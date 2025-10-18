// src/middlewares/uploadMiddleware.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Kiểm tra và tạo thư mục uploads nếu chưa có
const uploadDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Định nghĩa nơi lưu trữ file tạm thời
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname.replace(/\s/g, '_'));
    }
});

// Cấu hình Multer: giới hạn 1 file với key là 'document'
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // Giới hạn 10MB
}).single('document');
// Xuất middleware đã cấu hình để sử dụng trong routes
module.exports = upload;