 var express = require('express');
 var multer = require('multer');
 var bodyParser = require('body-parser');

 const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './Images')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname)
    }
  })

var memStorage = multer.memoryStorage()
var upload = multer({ storage: memStorage })

const imageFilter = function (req, file, cb) {
    // accept image only
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

 var upload = multer(
    { 
         storage: memStorage,
         fileFilter: imageFilter,
         limits: {
            files: 5,
            fileSize: 5000000
         }
    })

 const app = express();
 app.use(bodyParser.json());

 //Upload Single
 app.post('/profile', upload.single('avatar'), (req, res) => {
    try {
        console.log(req.file)
        res.send(req.file)
    } catch (err) {
        res.sendStatus(400);
    }
})

//Upload Multi
app.post('/photos', (req, res) => {
    upload.array('photos', 12)(req,res, (err)=>{
        if(err){
            console.log(`Failed to upload photos. ${err}`)
            return res.status(400).send(err);
        }
        return res.send(req.files)
    })
})

 app.listen(5000, function () {
    console.log('listening on port 5000!');
});