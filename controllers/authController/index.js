const authService = require('../../services/authService');

// [POST] /login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await authService.login({ email, password });

    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 400);
    res.json(error);
  }
};

// [POST] /register
const register = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    const result = await authService.register({ fullname, email, password });

    res.status(201).json(result);
  } catch (error) {
    res.status(error.status || 400);
    res.json(error);
  }
};

// [POST] /logout
const logout = async (req, res) => {
  try {
    const userId = req.userId;

    const result = await authService.logout({ userId });

    if( result.success ) {
      return res.status(200).json(result);
    }

    res.status(401).json(result);
  } catch (error) {
    res.status(error.status || 400);
    res.json(error);
  }
};

// [POST] /refresh-token
const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken;

    const result = await authService.refreshToken({ refreshToken });

    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 401);
    res.json(error);
  }
};


module.exports = {
  login,
  register,
  logout,
  refreshToken
};
