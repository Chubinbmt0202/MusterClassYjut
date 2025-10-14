const { client } = require('../config/db.config');

// hàm thực hiện truy vấn lấy tất cả người dùng
async function getAllUsers() {
    try {
        const res = await client.query('SELECT * FROM NguoiDung');
        console.log("Lấy tất cả người dùng thành công:", res.rows);
        return res.rows;
    } catch (error) {
        console.error("Lỗi khi lấy tất cả người dùng:", error);
        throw error;
    }
}

module.exports = {
    getAllUsers,
};