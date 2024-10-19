import dotenv from 'dotenv';
dotenv.config();
import express from 'express'
import errorHandler from './middlewares/errorHandler.js';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import {connectDB} from './config/db.js';
import userRoute from './routes/userRoute.js';
import documentRoute from './routes/documentRoute.js';
import noteRoute from './routes/noteRoute.js';

const app = express();

connectDB();

import cors from 'cors';

// Enable CORS
app.use(cors({
    origin: 'http://localhost:5173', // Allow requests only from this origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // If you need to handle cookies or auth
}));

// ... rest of your code

const port = process.env.PORT || 5100;

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(errorHandler);
app.use(cookieParser());

app.use("/api/user",userRoute);
app.use("/api/document",documentRoute);
app.use("/api/notes",noteRoute);

app.listen(port,()=>{
    console.log(`http://localhost:${port}`);
})
