const multer = require('multer');
const ApiError = require('../utils/apiError');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new ApiError('Only images allowed', 400), false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
});

// single
exports.uploadSingleImage = (fieldName) =>
    upload.single(fieldName);

// multiple fields 
exports.uploadMixOfImages = (fieldsArray) =>
    upload.fields(fieldsArray);