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
  editUserDescription
};
