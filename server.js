// Import các thư viện cần thiết
require('dotenv').config(); // Nạp các biến môi trường từ file .env
const express = require('express');
const { Pool } = require('pg');
const { connectToDatabase } = require('./src/config/db.config');

// Khởi tạo ứng dụng Express
const app = express();
const port = process.env.PORT || 3000;

// Middleware để phân tích JSON
app.use(express.json());

// Kết nối đến cơ sở dữ liệu PostgreSQL
connectToDatabase();

// Định nghĩa các routes
app.get('/', (req, res) => {
    res.send('Hello World!');
    console.log('Hello World! Server is running.');

});

// Bắt đầu lắng nghe các kết nối đến server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

