const createError = require("http-errors");
const axios = require('axios');

const User = require('../../models/User');
const bcryptHelper = require('../../helpers/bcrypt');
const jwtHelpter = require('../../helpers/jwt');

const _getBasicDetailUser = (user) => {
  return {
    userId: user._id,
    fullname: user.fullname,
    email: user.email,
    description: user.description
  }
};

const login = async ({email, password}) => {
  try {
    let user = await User.findOne({ email });

    if( !user ) {
      throw createError(401, `User with email '${email}' not found`);
    }

    const isMatchPassword = await bcryptHelper.comparePassword(password, user.password);

    if (!isMatchPassword) throw createError(401, `Wrong password`);

    const accessToken = jwtHelpter.generateAccessToken({ 
      userId: user._id,
      email
    });

    const refreshToken = jwtHelpter.generateRefreshToken({ userId: user._id });

    user.accessToken = accessToken;
    user.refreshToken = refreshToken;

    await user.save();

    return {
      user: _getBasicDetailUser(user),
      accessToken,
      refreshToken,
      success: true,
      message: 'Login successfully!'
    };
  } catch (error) {
    throw createError(error.statusCode || 500, error.message);
  }
};

const register = async ({
  fullname,
  email,
  password
}) => {
  try {
    const existedUser = await User.findOne({ email });

    if( existedUser ) {
      throw createError(400, `Email '${email}' already exists`);
    }

    const hassPassword = await bcryptHelper.hashPassword(password);

    let newUser = new User({
      fullname,
      email,
      password: hassPassword
    });

    const accessToken = jwtHelpter.generateAccessToken({ 
      userId: newUser._id,
      email
    });

    const refreshToken = jwtHelpter.generateRefreshToken({ userId: newUser._id });

    newUser.accessToken = accessToken;
    newUser.refreshToken = refreshToken;

    const userContacts = await axios.post(`${process.env.ZATO_MODULE_SERVER}/user-contacts`, {
      userId: newUser._id
    });

    if( userContacts.data.success ) await newUser.save();

    return {
      user: _getBasicDetailUser(newUser),
      accessToken,
      refreshToken,
      success: true,
      message: 'Register successfully!'
    };
  } catch (error) {
    throw createError(error.statusCode || 500, error.message);
  }
};

const logout = async ({ userId }) => {
  try {
    let user = await User.findById(userId);

    if( !user ) {
      return {
        success: false,
        message: 'User ID is not exist'
      }
    }

    user.accessToken = null;
    user.refreshToken = null;

    await user.save();

    return {
      success: true,
      message: 'Logout successfully!' 
    };
  } catch (error) {
    throw createError(error.statusCode || 500, error.message);
  }
};

const checkAuth = async ({ accessToken }) => {
  try {
    const decode = jwtHelpter.verifyAccessToken(accessToken);

    const userByToken = await User.findOne({ _id: decode.userId });

    if ( !userByToken ) {
      throw createError(401, "User with accessToken does not exist");
    }

    if( userByToken.accessToken !== accessToken ) {
      throw createError(401, "accessToken is invalid");
    }

    return {
      userId: userByToken._id
    }
  } catch (error) {
    throw createError(error.statusCode || 401, error.message || "accessToken is invalid");
  }
};

const refreshToken = async ({ refreshToken }) => {
  try {
    const decode = jwtHelpter.verifyRefreshToken(refreshToken);

    const userByToken = await User.findOne({ _id: decode.userId });

    if ( !userByToken ) {
      throw createError(401, "User with refreshToken does not exist");
    }

    if( userByToken.refreshToken !== refreshToken ) {
      throw createError(401, "refreshToken is invalid");
    }

    const accessToken = jwtHelpter.generateAccessToken({ 
      userId: userByToken._id,
      email: userByToken.email
    });

    refreshToken = jwtHelpter.generateRefreshToken({ userId: userByToken._id });

    userByToken.accessToken = accessToken;
    userByToken.refreshToken = refreshToken;

    await userByToken.save();

    return {
      accessToken,
      refreshToken,
      success: true,
      message: 'Refresh accessToken successfully!'
    };
  } catch (error) {
    throw createError(error.statusCode || 401, error.message || "refreshToken is invalid");
  }
};

module.exports = {
  login,
  register,
  logout,
  checkAuth,
  refreshToken
};
