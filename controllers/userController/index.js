const { response } = require('express');
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

module.exports = {
  getProfile,
  editUserDescription
};
