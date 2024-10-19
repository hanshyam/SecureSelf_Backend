import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import userModel from '../models/userModel.js';

const validateToken = asyncHandler(async (req, res, next) => {
    let token;
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];
        try {
            const decoded = jwt.verify(token, process.env.MY_TOKEN_STRING);
            req.user = decoded.user; 
            console.log("m",req.user);
            next();
        } catch (err) {
            console.error("Token verification failed:", err.message);
            res.status(401);
            throw new Error("User is not Authorized!");
        }
    } else {
        res.status(401);
        throw new Error("User is not authorized or token is missing!");
    }
});




const isAdmin = asyncHandler(async (req, res, next) => {
    const {email} = req.user;
    const AdminUser = await userModel.findOne({email});

    if(AdminUser.role !== "admin"){
      res.status(401);
      throw new Error("User is not Authorized!");
    }
    next();
});

export { validateToken, isAdmin };
