const dotenv = require('dotenv');
dotenv.config();
import express from "express";
import connectToDb from './DB/db.js'
import userRoutes from './routes/user.router.js'
import postRouter from './routes/post.router.js'
import followRouter from './routes/follow.router.js'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors({
    origin: "http://localhost:5173",
    methords: ["GET","POST"],
    credentials: true
}))
app.use(express.urlencoded({ extended: true}))
app.use(express.json());
app.use(cookieParser()); 

app.get("/", (req,res)=>{
    res.send("Backend is Running");
});

app.use("/user", userRoutes);
// app.use('/posts', postRouter);
// app.use('/follow', followRouter);

app.listen(PORT, ()=> {
    console.log('Server is running');
    connectToDb();
});

