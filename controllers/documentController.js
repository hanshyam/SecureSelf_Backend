import { cloudinaryUploadImg } from "../utils/cloudinary.js";
import asyncHandler from 'express-async-handler'
import fs from 'fs/promises'
import documentModel from "../models/documentModel.js";
//import // validate here your mongo id from "../utils/validateMongoId.js";


const addDocument = asyncHandler( async(req,res)=>{
   const {category,description,imageUrl} = req.body;
   const userId = req.user._id;

   const newDocument = await documentModel.create({
     category,
     description,
     imageUrl,
     userId
   })
   res.json({message:"document created successfully",newDocument});
})

const getDocuments = asyncHandler( async(req,res)=>{
   const { _id } = req.user;
   const documents = await documentModel.find({ userId:_id })
   res.json(documents);
})

// import fs from 'fs/promises'; // Ensure you're importing from fs/promises

// const uploadImages = asyncHandler(async (req, res) => {
//     try {
//         const uploader = (path) => cloudinaryUploadImg(path, "image");
//         const urls = []; 

//         const file = req.file; 
//         if (!file) {
//             return res.status(400).json({ message: "No file uploaded." });
//         }

//         const filePath = file.path; 
//         const newPath = await uploader(filePath);
//         urls.push(newPath);

//         res.json(urls); 
//     } catch (error) {
//         console.error("Error uploading image:", error);
//         res.status(500).json({ message: "Error uploading image", error: error.message });
//     }
// });




export {
    // uploadImages,
    addDocument,
    getDocuments
}