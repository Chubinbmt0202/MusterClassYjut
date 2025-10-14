// src/controllers/user.controller.js
const userService = require('../services/user.service');

// Hàm này xử lý logic cho route GET /api/users
async function getAllUsersController(req, res) {
    try {
        // Gọi service để lấy dữ liệu
        const users = await userService.getAllUsersServices();
        // Gửi response thành công
        res.status(200).json(users);
    } catch (err) {
        // Xử lý lỗi và gửi response lỗi
        console.error('Error in user.controller getAllUsers:', err.stack);
        res.status(500).send('Error retrieving data from database');
    }
}

module.exports = {
    getAllUsersController
};