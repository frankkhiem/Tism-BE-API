const login = (req, res, next) => {
  const { email, password } = req.body;
  
  const errorMessage = [];

  if( !email ) {
    errorMessage.push('email is required in request body');
  } else {
    if( !(/\S+@\S+/.test(email)) ) {
      errorMessage.push('email format wrong');
    }
  }

  if( !password ) {
    errorMessage.push('password is required in request body');
  } else {
    if( password.length < 6 ) {
      errorMessage.push('password must be at least 6 characters');
    }
  }

  if( errorMessage.length > 0 ) {
    return res.status(400).json({
      success: false,
      message: errorMessage[0]
    });
  }
  
  next();
};

const register = (req, res, next) => {
  const { fullname, email, password } = req.body;
  
  const errorMessage = [];

  if( !fullname ) {
    errorMessage.push('fullname is required in request body');
  }

  if( !email ) {
    errorMessage.push('email is required in request body');
  } else {
    if( !(/\S+@\S+/.test(email)) ) {
      errorMessage.push('email format wrong');
    }
  }

  if( !password ) {
    errorMessage.push('password is required in request body');
  } else {
    if( password.length < 6 ) {
      errorMessage.push('password must be at least 6 characters');
    }
  }

  if( errorMessage.length > 0 ) {
    return res.status(400).json({
      success: false,
      message: errorMessage[0]
    });
  }
  
  next();
};

const refreshToken = (req, res, next) => {
  const { refreshToken } = req.body;

  if( !refreshToken ) {
    return res.status(400).json({
      success: false,
      message: 'refreshToken is required in request body'
    });
  }

  next();
};

module.exports = {
  login,
  register,
  refreshToken
};
