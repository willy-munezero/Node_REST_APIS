const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');


const mongoose = require('mongoose');
// connect to mongodb & listen for requests
const dbURI = "mongodb+srv://willychris:willy1234@nodetut.bzecqg9.mongodb.net/messages?retryWrites=true&w=majority";

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');
const Post = require('./models/post');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');


   

// const storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//         cb(null, 'images');
//     },
//     filename: function(req, file, cb) {
//         cb(null, uuidv4())
//     }
// });
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'images');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname); // Use the original filename
    }
});
 const  fileFilter = (req, file, cb) =>{
    if(
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'

    ){
        cb(null, true);
    }else{
        cb(null, false);
    }
 };

app.use(bodyParser.json()); // application/json

app.use(
  multer({storage: storage, fileFilter: fileFilter}).single('image')

);
//parsing images to view it on the client side
app.use('/images', express.static(path.join(__dirname, 'images')));



//allowing CORS(cross-orgin-resource sharing works on server)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.use((error, req, res, next) =>{
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data});

});
app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => app.listen(8070))
  .catch(err => console.log(err));


//adding routes