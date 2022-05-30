const createError = require("http-errors");

const User = require('../../models/User');
const fs = require('fs');
const { uploadToFirebase } = require('../../helpers/firebase/storage');

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

const getUserStatus = async ({ userId }) => {
  try {
    const user = await User.findById(userId);

    return { status: user.status };
  } catch (error) {
    throw createError(error.statusCode || 500, error.message);
  }
};

const updateStatus = async ({ userId, status }) => {
  try {
    const user = await User.findById(userId);

    user.status = status;

    await user.save();

    return {
      success: true,
      message: 'Update user status successfully'
    };
  } catch (error) {
    throw createError(error.statusCode || 500, error.message);
  }
};

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

const uploadAvatar = async ({ userId, avatar }) => {
  try {
    const uploadUrls = await uploadToFirebase(
      avatar.path, 
      `uploads/usersProfile/avatars/${userId}`,
      avatar.filename
    );
    
    return await updateAvatar({ userId, avatar: uploadUrls.url });
  } catch (error) {
    throw createError(error.statusCode || 500, error.message || 'Internal Server Error');
  } finally {
    // Xóa file ở tmp/ cả khi thành công hoặc không thành công
    fs.unlink(avatar.path, (error) => {
      if( error ) {
        throw error;
      }
    });
  }
};

module.exports = {
  getProfile,
  getUserStatus,
  updateStatus,
  updateAvatar,
  updateDescription,
  uploadAvatar
};