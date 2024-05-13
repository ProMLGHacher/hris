import multer from "multer";

// воздание образа хранилища файлов
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/avatars'); // Upload avatar files to the 'uploads/avatars' directory
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Keep the original filename
    }
});

// фильтрация файлов на картинку
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'), false);
    }
};

// объект загрузчика файлов
export const upload = multer({ storage: storage, fileFilter: fileFilter });