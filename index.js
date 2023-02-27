import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import  dotenv from "dotenv";
import multer from 'multer';
import helmet from "helmet";
import morgan from "morgan";
import path from 'path';
import {fileURLToPath} from 'url';
import {register} from ".controllers/auth.js";

/* Configurations */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app =express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy:"cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

app.get("/", (req, res) => {
    res.send("Hello World!");
  });
  app.listen(3000, () => {
    console.log("Server started on port 3000");
  });
/* File Storage */
const storeage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"public/assets");
    },
    filename:function(req,file,cb){
        cb(null,"public/assets");
    }
})
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })
const upload = multer({ storage: storage });
 
/* Routes With Files*/
app.post("/auth/register",upload.single("picture"),register);

/* MONGOOS Setup */
const PORT = process.env.PORT || 6000;
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true,

}).then(()=>{
    app.listen(PORT,()=>console.log('Server Port: ${PORT}'));

}).catch((error)=>console.log('${error} did not connect'));