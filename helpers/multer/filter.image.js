module.exports = (req, file, cb) => {
  if( (/^image\/.+$/).test(file.mimetype) ) {
    cb(null, true);
  } else {
    cb(new Error("Not a Image File!"), false);
  }
};
