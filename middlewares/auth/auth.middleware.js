const createError = require("http-errors");
const authService = require('../../services/authService');

const checkAuth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if( !authorization ) throw createError(403, "No accessToken provided");

    const accessToken = authorization.split(" ")[1];
    const result = await authService.checkAuth({ accessToken });

    if( result ) req.userId = result.userId;
    next();
  } catch (error) {
    res.status(error.status || 401);
    res.json(error);
  }
};

module.exports = {
  checkAuth
};
