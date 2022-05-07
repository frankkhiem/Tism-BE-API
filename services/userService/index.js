const createError = require("http-errors");

const User = require('../../models/User');

const _getBasicDetailUser = (user) => {
  return {
    userId: user._id,
    fullname: user.fullname,
    email: user.email,
    description: user.description
  }
};

const getProfile = async ({ userId }) => {
  try {
    const user = await User.findById(userId);

    return _getBasicDetailUser(user);
  } catch (error) {
    throw createError(error.statusCode || 500, error.message);
  }
};

const updateUsername = async ({ userId, fullname }) => {
  try {
    const user = await User.findById(userId);
    user.fullname = fullname
    await user.save();
    return {
      success: true,
      message: 'Update user name successfully'
    };
  } catch (error) {
    throw createError(error.statusCode || 500, error.message);
  }
};

const updateDescription = async ({ userId, description }) => {
  try {
    const user = await User.findById(userId);

    user.description = description;

    await user.save();

    return {
      success: true,
      message: 'Update user description successfully'
    };
  } catch (error) {
    throw createError(error.statusCode || 500, error.message);
  }
};

module.exports = {
  getProfile,
  updateDescription,
  updateUsername
};
