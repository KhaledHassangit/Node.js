const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const asyncHandler = require('express-async-handler');

exports.resizeSingleImage = ({
    folder,
    fieldName = 'image',
    width = 600,
    height = 600,
    quality = 90,
}) =>
    asyncHandler(async (req, res, next) => {
        if (!req.file) return next();

        const filename = `${folder}-${uuidv4()}-${Date.now()}.webp`;

        await sharp(req.file.buffer)
            .resize(width, height, {
                fit: 'cover',
                position: 'center',
            })
            .toFormat('webp')
            .webp({ quality })
            .toFile(`uploads/${folder}/${filename}`);

        req.body[fieldName] = filename;

        next();
    });
    
exports.resizeImages = ({
    folder,
    imageCoverField = 'imageCover',
    imagesField = 'images',
}) =>
    asyncHandler(async (req, res, next) => {

        // 🔹 imageCover
        if (req.files?.[imageCoverField]) {
            const filename = `${folder}-${uuidv4()}-${Date.now()}-cover.webp`;

            await sharp(req.files[imageCoverField][0].buffer)
                .resize(2000, 1333, { fit: 'cover', position: 'center' })
                .toFormat('webp')
                .webp({ quality: 90 })
                .toFile(`uploads/${folder}/${filename}`);

            req.body[imageCoverField] = filename;
        }

        // 🔹 images
        if (req.files?.[imagesField]) {
            req.body[imagesField] = [];

            await Promise.all(
                req.files[imagesField].map(async (img, index) => {
                    const filename = `${folder}-${uuidv4()}-${Date.now()}-${index + 1}.webp`;

                    await sharp(img.buffer)
                        .resize(2000, 1333, { fit: 'cover', position: 'center' })
                        .toFormat('webp')
                        .webp({ quality: 90 })
                        .toFile(`uploads/${folder}/${filename}`);

                    req.body[imagesField].push(filename);
                })
            );
        }

        next();
    });