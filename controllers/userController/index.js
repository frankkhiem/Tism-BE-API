const userService = require('../../services/userService');

// [GET] /user/profile
const getProfile = async (req, res) => {
  try {
    const userId = req.userId;
    
    const result = await userService.getProfile({ userId });

    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 400);
    res.json(error);
  }
};

// [GET] /user/status
const getUserStatus = async (req, res) => {
  try {
    const userId = req.userId;
    
    const result = await userService.getUserStatus({ userId });

    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 400);
    res.json(error);
  }
};

// [GET] /user/status
const getPersonStatus = async (req, res) => {
  try {
    const { personId } = req.params;
    
    const result = await userService.getUserStatus({ userId: personId });

    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 400);
    res.json(error);
  }
};

// [PATCH] /user/status
const editUserStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const userId = req.userId;

    const result = await userService.updateStatus({ userId, status });

    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 400);
    res.json(error);
  }
};

// [PATCH] /user/fullname
const editUserFullname = async (req, res) => {
  try {
    const { fullname } = req.body;

    const userId = req.userId;

    const result = await userService.updateFullname({ userId, fullname });

    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 400);
    res.json(error);
  }
};

// [PATCH] /user/avatar
const editUserAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;

    const userId = req.userId;

    const result = await userService.updateAvatar({ userId, avatar });

    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 400);
    res.json(error);
  }
};

// [POST] /user/avatar/upload
const uploadUserAvatar = async (req, res) => {
  try {
    const userId = req.userId;
    const avatar = req.file;

    const result = await userService.uploadAvatar({ userId, avatar });

    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 400);
    res.json(error);
  }
};

// [PATCH] /user/description
const editUserDescription = async (req, res) => {
  try {
    const { description } = req.body;

    const userId = req.userId;

    const result = await userService.updateDescription({ userId, description });

    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 400);
    res.json(error);
  }
};

const getAllUser = async (req, res) => {
  try {
    const result = await userService.getAllUser({});

    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 400);
    res.json(error);
  }
};

module.exports = {
  getProfile,
  getUserStatus,
  getPersonStatus,
  editUserStatus,
  editUserFullname,
  editUserAvatar,
  uploadUserAvatar,
  editUserDescription,
  getAllUser,
};