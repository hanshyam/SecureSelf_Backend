// import multer from 'multer';
// import path from 'path';
// import sharp from 'sharp';
// import { fileURLToPath } from 'url';
// import fs from 'fs/promises'; // Use fs/promises for async file operations

// // Recreate __dirname
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Configure multer storage
// const multerStorage = multer.diskStorage({
//     destination: function(req, file, cb) {
//         cb(null, path.join(__dirname, "../public/images")); // Destination for uploaded files
//     },
//     filename: function(req, file, cb) {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//         cb(null, file.fieldname + "-" + uniqueSuffix + ".jpeg"); // Filename format
//     }
// });

// // File filter to accept only images
// const multerFilter = (req, file, cb) => {
//     if (file.mimetype.startsWith('image')) {
//         cb(null, true); // Accept the file
//     } else {
//         cb(new Error("Unsupported file format"), false); // Reject the file
//     }
// };

// // Initialize multer for single file upload
// const uploadPhoto = multer({
//     storage: multerStorage,
//     fileFilter: multerFilter,
//     limits: { fileSize: 2000000 } // Set file size limit to 2MB
// }).single('image'); // Use .single() for single file upload

// // Middleware to resize the uploaded image
// // const documentImgResize = async (req, res, next) => {
// //     if (!req.file) return next(); // If no file uploaded, skip resizing

// //     try {
// //         const documentDir = path.join(__dirname, "../public/images/document");

// //         // Ensure the directory exists
// //         await fs.mkdir(documentDir, { recursive: true });

// //         const originalPath = req.file.path; // Save the original path

// //         // Resize the uploaded image
// //         await sharp(originalPath)
// //             .resize(300, 300) // Resize dimensions
// //             .toFormat('jpeg')
// //             .jpeg({ quality: 90 }) // Set JPEG quality
// //             .toFile(`${documentDir}/${req.file.filename}`); // Save resized image

// //         // Update the file path to the resized image
// //         req.file.path = `${documentDir}/${req.file.filename}`;

// //         // Remove the original file after resizing
// //         await fs.unlink(originalPath);
// //     } catch (error) {
// //         console.error("Error in documentImgResize:", error);
// //         return next(error); // Pass any error to the next middleware
// //     }

// //     next(); // Move to the next middleware
// // };

// // Export the middleware functions
// export { uploadPhoto, documentImgResize };



import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import asyncHandler from 'express-async-handler';
import fs from 'fs/promises'; // Use fs/promises for async file operations
import { cloudinaryUploadImg } from "../utils/cloudinary.js";

// Recreate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer storage
const multerStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, "../public/images")); // Destination for uploaded files
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + ".jpeg"); // Filename format
    }
});

// File filter to accept only images
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true); // Accept the file
    } else {
        cb(new Error("Unsupported file format"), false); // Reject the file
    }
};

// Multer middleware setup
const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
});

// Image upload controller
const uploadImages = asyncHandler(async (req, res) => {
    try {
        const file = req.file; // Multer stores the file in req.file
        if (!file) {
            return res.status(400).json({ message: "No file uploaded." });
        }

        const filePath = path.join(__dirname, "../public/images", file.filename); // Full file path

        // Upload to cloudinary or save the file URL as needed
        const uploader = (path) => cloudinaryUploadImg(path, "image"); // Your cloudinary upload function
        const uploadedUrl = await uploader(filePath);

        // Clean up local file (optional)
        await fs.unlink(filePath); // Remove original image from local storage after uploading to cloud
        console.log(uploadedUrl)
        res.json({ message: "Image uploaded successfully", url: uploadedUrl });
    } catch (error) {
        console.error("Error uploading image:", error);
        res.status(500).json({ message: "Error uploading image", error: error.message });
    }
});

export {uploadImages,upload};

