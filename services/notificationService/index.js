const createError = require("http-errors");
const { translateAliases } = require("../../models/User");

const User = require('../../models/User');
const Notification = require('../../models/notification');

// const getAllNotifications = async ({ userId }) => {
//     const users = await User.find({userId});
//     const notifications = await Notification.find({"owner": userId});
//     let allTeam = new Array()
//     teams.map(team => {
//       if (team.member.includes(user._id)) {
//         allTeam.push({ teamName: team.teamName, teamId: team._id, type: team.type, avatar: team.avatar })
//       }
//     })
//     return allTeam;
//   }

  const getAllNotifications = async ({ userId }) => {
    const users = await User.find({userId});
    const notifications = await Notification.find({"owner": userId}).sort({ owner : 1});
    // let allTeam = new Array()
    // teams.map(team => {
    //   if (team.member.includes(user._id)) {
    //     allTeam.push({ teamName: team.teamName, teamId: team._id, type: team.type, avatar: team.avatar })
    //   }
    // })
    return notifications;
  }

  module.exports = {
    getAllNotifications,
  };