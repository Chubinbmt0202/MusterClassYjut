// src/routes/fileRoutes.js
const express = require('express');
// Đảm bảo đường dẫn này đúng: nếu fileRoutes.js nằm trong src/routes/ 
// và uploadMiddleware.js nằm trong src/middlewares/, thì đường dẫn phải là:
const upload = require('../middleware/uploadMiddleware'); // Đã sửa đường dẫn
const fs = require('fs');
const { GoogleGenAI } = require('@google/genai')
const router = express.Router();

// khởi tạo gemini client
const ai = new GoogleGenAI({
    apiKey: "AIzaSyDSoUFGb0wZk9g1va_y-TCV9AA14UJZ24w", // Sử dụng biến môi trường để bảo mật
});

console.log("Sử dụng GEMINI_API_KEY:", process.env.GEMINI_API_KEY);

/**
 * Hàm chuyển đổi file local thành đối tượng Part cho Gemini
 * @param {string} path - Đường dẫn file trên server
 * @param {string} mimeType - Loại MIME của file
 * @returns {object} Đối tượng Part
 */

function fileToGenerativePart(path, mimeType) {
    // Đọc file dưới dạng Buffer và mã hóa Base64
    if (!mimeType) {
        console.log("Không có MIME type, sử dụng mặc định.");
        const fixedMimeType = 'application/pdf';
        mimeType = fixedMimeType;
    }

    return {
        inlineData: {
            data: Buffer.from(fs.readFileSync(path)).toString("base64"),
            mimeType,
        },
    };
}

// Hàm xử lý logic chính sau khi file được upload
const processFileHandler = async (req, res) => {
    // Nếu Multer thành công, req.file sẽ có dữ liệu
    if (!req.file || Object.keys(req.file).length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Không có file nào được tải lên.'
        });
    }

    console.log("File đã được tải lên:", req.file);
    const { path, mimeType, filename } = req.file;
    const userPrompt = `Bạn là một trợ lý giáo dục AI chuyên tạo nội dung tương tác cho học sinh tiểu học.
                            Nhiệm vụ của bạn là phân tích một bài giảng được cung cấp và tạo ra các loại câu hỏi/trò chơi phù hợp, hấp dẫn cho học sinh tiểu học (lớp 2)).

                            Dữ liệu đầu vào:
                            - Tiêu đề bài giảng: ""
                            - Nội dung bài giảng: ""
                            - Cấp độ học sinh: Lớp 2

                            Hãy tạo ra một đối tượng JSON duy nhất chứa tất cả các loại trò chơi yêu cầu.
                            Mỗi loại trò chơi phải chứa ít nhất 3 mục (câu hỏi, cặp nối, thẻ, v.v.).

                            Các loại trò chơi cần tạo:

                            1.  **Trắc nghiệm (bao gồm A, B, C, D; Đúng/Sai; Điền vào chỗ trống):**
                                * **Trắc nghiệm A, B, C, D:**
                                    * Tạo câu hỏi dựa trên các thông tin, sự kiện, khái niệm quan trọng trong bài giảng.
                                    * Mỗi câu hỏi phải có 1 đáp án đúng và 3 đáp án nhiễu (sai nhưng hợp lý, không quá dễ đoán hoặc quá lạc đề).
                                    * Ngôn ngữ phải đơn giản, rõ ràng, phù hợp với học sinh tiểu học Lớp 2.
                                * **Đúng/Sai:**
                                    * Tạo các nhận định (statements) dựa trên nội dung bài giảng.
                                    * Một nửa số nhận định nên là đúng, và một nửa là sai (bằng cách thay đổi một chi tiết nhỏ hoặc phủ định thông tin đúng).
                                    * Đảm bảo nhận định không gây hiểu lầm nghiêm trọng.
                                * **Điền vào chỗ trống:**
                                    * Chọn các câu trong bài giảng có chứa từ khóa quan trọng (danh từ riêng, thuật ngữ, số liệu chính).
                                    * Thay thế từ khóa đó bằng dấu "___" và cung cấp đáp án chính xác.
                                    * Câu hỏi phải rõ ràng, chỉ có một đáp án duy nhất đúng.

                            2.  **Nối cặp:**
                                * Tìm các cặp thông tin có mối liên hệ rõ ràng trong bài giảng (ví dụ: "Sự vật" - "Đặc điểm", "Thuật ngữ" - "Định nghĩa", "Tên" - "Chức năng").
                                * Tạo các cặp này sao cho các mục ở cột A và cột B được xáo trộn ngẫu nhiên trong game, học sinh phải tự nối.

                            3.  **Lật thẻ ghi nhớ (Flashcards):**
                                * Trích xuất các khái niệm chính, từ vựng, hoặc sự kiện quan trọng.
                                * Mỗi thẻ có Mặt trước (khái niệm/từ khóa) và Mặt sau (định nghĩa/giải thích ngắn gọn).
                                * Đảm bảo nội dung ngắn gọn, dễ nhớ.

                            4.  **Phân loại:**
                                * Xác định 2-3 danh mục (categories) chính có trong bài giảng.
                                * Liệt kê các mục (items) thuộc về mỗi danh mục đó.
                                * Đảm bảo các mục được phân loại rõ ràng và không chồng chéo, phù hợp với Lớp 2.

                            **Định dạng đầu ra:**
                            Bạn phải trả về một đối tượng JSON duy nhất theo cấu trúc sau. Đảm bảo tất cả các trường (keys) và kiểu dữ liệu (values) đều chính xác.

                            
                            {
                            "lesson_title": "",
                            "generated_games": [
                                {
                                "game_type": "multiple_choice_abcd",
                                "questions": [
                                    {
                                    "question_text": "Thủ đô của Việt Nam là thành phố nào?",
                                    "options": ["Hà Nội", "Đà Nẵng", "TP. Hồ Chí Minh", "Hải Phòng"],
                                    "correct_answer_index": 0
                                    },
                                    {
                                    "question_text": "Hành tinh nào gần Mặt Trời nhất?",
                                    "options": ["Sao Thủy", "Sao Kim", "Trái Đất", "Sao Hỏa"],
                                    "correct_answer_index": 0
                                    }
                                ]
                                },
                                {
                                "game_type": "true_false",
                                "statements": [
                                    {
                                    "statement_text": "Cá voi là động vật sống dưới nước và đẻ trứng.",
                                    "is_true": false
                                    },
                                    {
                                    "statement_text": "Mặt Trăng quay quanh Trái Đất.",
                                    "is_true": true
                                    }
                                ]
                                },
                                {
                                "game_type": "fill_in_the_blank",
                                "sentences": [
                                    {
                                    "sentence_with_blank": "Gió là không khí đang ___.",
                                    "answer": "chuyển động"
                                    },
                                    {
                                    "sentence_with_blank": "Số lớn nhất có một chữ số là ___.",
                                    "answer": "9"
                                    }
                                ]
                                },
                                {
                                "game_type": "matching",
                                "instruction": "Hãy nối các con vật với tiếng kêu của chúng.",
                                "pairs": [
                                    { "item_a": "Con chó", "item_b": "Gâu gâu" },
                                    { "item_a": "Con mèo", "item_b": "Meo meo" },
                                    { "item_a": "Con bò", "item_b": "O ò" }
                                ]
                                },
                                {
                                "game_type": "flashcards",
                                "deck_title": "Ôn tập Từ vựng Khoa học",
                                "cards": [
                                    {
                                    "front": "Quang hợp",
                                    "back": "Quá trình cây xanh tự tạo thức ăn nhờ ánh sáng mặt trời."
                                    },
                                    { "front": "Hệ Mặt Trời", "back": "Gồm Mặt Trời và các thiên thể quay quanh nó." }
                                ]
                                },
                                {
                                "game_type": "sorting",
                                "instruction": "Kéo thả các con vật vào đúng nhóm của chúng.",
                                "categories": [
                                    {
                                    "category_name": "Động vật có vú",
                                    "items": ["Con chó", "Con bò", "Con mèo"]
                                    },
                                    {
                                    "category_name": "Động vật đẻ trứng",
                                    "items": ["Con gà", "Con vịt", "Con rắn"]
                                    }
                                ]
                                }
                            ]
                            }
                            `;

    try {
        const filePart = fileToGenerativePart(path, mimeType);

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                filePart,
                userPrompt
            ],
        });

        const geminiResult = response.text;
        console.log("Phản hồi từ Gemini API:", response);

        fs.unlinkSync(path); // Xoá file tạm sau khi xử lý

        // 4. Trả về kết quả cho Frontend
        return res.status(200).json({
            success: true,
            message: 'File đã được xử lý thành công.',
            result: geminiResult,
            filename: filename
        });
    } catch (error) {
        console.error("Lỗi khi gọi Gemini API:", error);
        return res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi xử lý file.',
            error: error.message
        });

    }
};


// Sửa đổi: Gắn middleware 'upload' (Multer) vào route '/test'
router.post('/test', upload, (req, res) => {
    processFileHandler(req, res);
});

module.exports = router;