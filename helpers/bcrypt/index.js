const bcrypt = require("bcrypt");

const hashPassword = (plainPassword) => {
  return bcrypt.hash(plainPassword, 10);
};

const comparePassword = (plainPassword, hashPassword) => {
  return bcrypt.compare(plainPassword, hashPassword);
};

module.exports = {
  hashPassword,
  comparePassword,
};