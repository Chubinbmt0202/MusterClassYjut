// src/services/user.service.js
const { getAllUsers } = require('../models/user.model');

async function getAllUsersServices() {
    try {
        // Gọi đến model để lấy dữ liệu
        const users = await getAllUsers();
        console.log('Fetched users:', users);
        return users;
    } catch (err) {
        console.error('Error in user.service getAllUsers:', err.stack);
        throw err;
    }
}

module.exports = {
    getAllUsersServices
};