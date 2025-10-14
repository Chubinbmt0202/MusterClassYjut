// src/api/user.routes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// Khi có request GET đến đường dẫn '/', nó sẽ được xử lý bởi userController.getAllUsers
router.get('/getAllUser', userController.getAllUsersController);

// (Trong tương lai, bạn có thể thêm các route khác)
// router.get('/:id', userController.getUserById);
// router.post('/', userController.createUser);

module.exports = router;