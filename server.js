// server.js
const express = require('express');
const cors = require('cors');
const fileRoutes = require('./src/route/fileRoutes'); // Import routes
// Thư viện dotenv để quản lý biến môi trường (cần cài npm i dotenv)
// require('dotenv').config(); 

const app = express();
const port = process.env.PORT || 3000; // Sử dụng biến môi trường

// --- 1. Cấu hình CORS ---
const allowedOrigins = [
    'http://localhost:5173',
    'https://musterclassyjut.onrender.com' // Ví dụ domain đã deploy
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Middleware cần thiết cho Express

// --- 2. Gắn Routes ---
// Tất cả các route trong fileRoutes sẽ được thêm prefix '/api'
app.use('/api', fileRoutes);

// --- 3. Khởi động Server ---
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});