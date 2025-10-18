// Import các thư viện cần thiết
require('dotenv').config(); // Nạp các biến môi trường từ file .env
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const { connectToDatabase, client } = require('./src/config/db.config');
const userRoutes = require('./src/api/user.routes');

// Khởi tạo ứng dụng Express
const app = express();
app.use(cors()); // Sử dụng CORS để cho phép các yêu cầu từ các nguồn khác nhau
const port = process.env.PORT || 3000;

// Middleware để phân tích JSON
app.use(express.json());

// Kết nối đến cơ sở dữ liệu PostgreSQL
connectToDatabase();
// Sử dụng các route đã định nghĩa trong userRoutes
app.use('/api', userRoutes);

app.get('/api/getData', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM NguoiDung');
        res.json(result.rows);
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).send('Error retrieving data from database');
    }
});

// Bắt đầu lắng nghe các kết nối đến server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

