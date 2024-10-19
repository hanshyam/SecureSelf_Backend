import express from 'express'
import { validateToken } from '../middlewares/validateTokenHandler.js';
import { upload, uploadImages } from '../middlewares/uploadImage.js';
import { addDocument, getDocuments } from '../controllers/documentController.js';

const router = express.Router();

router.post('/upload-image',validateToken,upload.single('image'),uploadImages);
router.post('/add-document',validateToken,addDocument);
router.get('/get-documents',validateToken,getDocuments);

export default router;