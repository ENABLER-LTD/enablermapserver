const multer = require('multer');
const path = require('path');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // cb(null, 'C:\\nginx-1.18.0\\nginx-1.18.0\\html')
        cb(null, 'upload/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})


const upload = multer({storage: storage});


module.exports = upload;
