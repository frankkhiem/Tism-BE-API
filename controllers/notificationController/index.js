const { response } = require('express');
const notificationService = require('../../services/notificationService');
const User = require('../../models/User');

// [GET] /allteams
const getAllNotifications = async (req, res) => {
    try {
      const userId = req.userId;
      //const user = await User.findById(userId);
      const result = await notificationService.getAllNotifications({
        userId
      });
  
      res.status(200).json(result);
    } catch (error) {
      res.status(error.status || 400);
      res.json(error);
    }
  }

  module.exports = {
    getAllNotifications
  };