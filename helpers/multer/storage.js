const multer  = require('multer');

module.exports = multer.diskStorage({
  destination: 'tmp/uploads',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
