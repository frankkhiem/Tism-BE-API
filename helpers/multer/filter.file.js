module.exports = (req, file, cb) => {
  if( (/^image\/.+$/).test(file.mimetype) ) {
    cb(new Error('Image file is not accepted!'), false);
  } else {
    cb(null, true);
  }
};
