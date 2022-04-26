const jwt = require("jsonwebtoken");

const accessTokenSecret = () => {
  return process.env.ACCESS_TOKEN_SECRET_KEY || 'few8Ge543jgwrh2@#4hof';
};

const refreshTokenSecret = () => {
  return process.env.REFRESH_TOKEN_SECRET_KEY || 'rgiFgwg4902#$FsfjJfljajLJFewf34';
}

const generateAccessToken = (data) => {
  return jwt.sign(
    data,
    accessTokenSecret(),
    {
      expiresIn: '1d'
    }
  );
};

const generateRefreshToken = (data) => {
  return jwt.sign(
    data,
    refreshTokenSecret(),
    {
      expiresIn: '30d'
    }
  );
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, accessTokenSecret());
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, refreshTokenSecret());
};

const decodeToken = (token) => {
  return jwt.decode(token);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  decodeToken,
};