import express from 'express';
import {
    deleteUser,
    getUser,
    logout,
    resetPassword,
    sendOtp,
    updateUser,
    userLogin,
    userRegister,
    verifyEmail
} 
from '../controllers/userController.js';
import {validateToken} from '../middlewares/validateTokenHandler.js';

const router = express.Router();

router.post('/register',userRegister);
router.post('/verify-email',verifyEmail);
router.post('/send-otp',sendOtp);
router.post('/login',userLogin);
router.get('/logout',logout);
router.get('/get-user',validateToken,getUser);
router.put('/reset-password/:id',resetPassword);
router.put('/update-user/:id',updateUser);
router.put('/delete-user/:id',deleteUser);

export default router;