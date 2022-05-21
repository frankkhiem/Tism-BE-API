const createError = require("http-errors");

const User = require('../../models/User');

const _getBasicDetailUser = (user) => {
  return {
    userId: user._id,
    fullname: user.fullname,
    email: user.email,
    avatar: user.avatar,
    status: user.status,
    description: user.description,
    countFriends: user.friends.length,
    createdAt: user.createdAt.toLocaleDateString('en-GB'),
    lastUpdatedAt: user.updatedAt.toLocaleDateString('en-GB')
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
    }
  }
    catch (error) {
      throw createError(error.statusCode || 500, error.message);
    }
}

const updateAvatar = async ({ userId, avatar }) => {
  try {
    const user = await User.findById(userId);

    user.avatar = avatar;

    await user.save();

    return {
      success: true,
      message: 'Update user avatar successfully'
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
  updateUsername,
  updateAvatar,
  updateDescription
};
