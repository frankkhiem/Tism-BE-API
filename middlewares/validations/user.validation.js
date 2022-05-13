const editUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  if( !avatar ) {
    return res.status(400).json({
      success: false,
      message: 'avatar is required in request body'
    });
  }
  next();
};

const editUserDescription = (req, res, next) => {
  const { description } = req.body;
  if( !description ) {
    return res.status(400).json({
      success: false,
      message: 'description is required in request body'
    });
  }
  next();
};

module.exports = {
  editUserAvatar,
  editUserDescription
};
