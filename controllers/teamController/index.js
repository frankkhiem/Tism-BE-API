const { response } = require('express');
const teamService = require('../../services/teamService');
const User = require('../../models/User');
// [GET] /allteams
const getAllTeam = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    const result = await teamService.getAllTeam({
      user
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 400);
    res.json(error);
  }
}
// [GET] /team
const getTeam = async (req, res) => {
  try {
    const teamId = req.params.id;
    const userId = req.userId;
    const result = await teamService.getTeam({
      teamId, userId
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 400);
    res.json(error);
  }
};
//[GET] get all member from team
// const getAllMembersOfTeam = async (req, res) => {
//   try {
//     const teamId = req.params.id;
//     const userId = req.userId;
//     const result = await teamService.getAllMembersOfTeam({
//       teamId, userId
//     });

// [GET] /team/:teamId/members
const getTeamMembersInfo = async (req, res) => {
  try {
    const { teamId } = req.params;
    const result = await teamService.getTeamMembersInfo({ teamId });

    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 400);
    res.json(error);
  }
};

//[POST] create new invite to friend

//     res.status(200).json(result);
//   } catch (error) {
//     res.status(error.status || 400);
//     res.json(error);
//   }
// };
//[POST] create new team 
const createTeam = async (req, res) => {
  try {
    const userId = req.userId;
    const teamName = req.body.teamName;
    const type = req.body.type;
    const is_private = req.body.is_private;
    const avatar = req.body.avatar;
    //let temp = req.body.invites;
    //temp.push(userId);
    const member = new Array();
    member.push(userId)
    //const invites = req.body.invites;

    //const description = req.body.description;
    const result = await teamService.createTeam({
      userId,
      //admin,
      teamName,
      type,
      is_private,
      avatar,
      member,
      //invites,
      //description,
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 400);
    res.json(error);
  }
};

///
const updateTeamDetail = async (req, res) => {
  try {
    const userId = req.userId;
    const teamId = req.body.teamId;
    const teamName = req.body.teamName;
    const type = req.body.type;
    const is_private = req.body.is_private;
    const avatar = req.body.avatar;
    const result = await teamService.updateTeam({ userId, teamId, teamName, type, is_private, avatar });

    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 400);
    res.json(error);
  }
};
//remove team
const removeTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    const userId = req.userId.toString();
    //const user = await User.findById(userId)
    const result = await teamService.removeTeam({ teamId, userId });

    if (result.success) {
      return res.status(200).json(result);
    }

    return res.status(400).json(result);
  } catch (error) {
    res.status(error.status || 400);
    res.json(error);
  }
};
//get all request from an user
const getAllInvite = async (req, res) => {
  try {
    const userId = req.userId;
    const result = await teamService.getAllInvite({
      userId
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 400);
    res.json(error);
  }
}
// update invite's accept 
const responseForInvite = async (req, res) => {
  try {
    const userId = req.userId;
    const inviteId = req.body.inviteId;
    const accept = req.body.accept;
    const result = await teamService.responseForInvite({
      userId,
      inviteId,
      accept,
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 400);
    res.json(error);
  }
}

//invite to anyone
const addMoreInvite = async (req, res) => {
  try {
    const userId = req.userId
    const teamId = req.body.teamId
    const inviteArray = req.body.inviteArray
    if(inviteArray.length == 0) return "array is null"
    const result = await teamService.addMoreInvite({
      teamId,
      userId,
      inviteeArray: inviteArray
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 400);
    res.json(error);
  }
};

// [GET] /team/:teamId/messages
const getRecentTeamMessages = async (req, res) => {
  try {
    const userId = req.userId;
    const { teamId } = req.params;
    const { skip, take } = req.query;

    const result = await teamService.getRecentTeamMessages({ userId, teamId, skip, take });

    if( result.success ) {
      return res.status(200).json(result);
    }
    return res.status(400).json(result);
  } catch (error) {
    res.status(error.status || 400);
    res.json(error);
  }
}

// [POST] /team/:teamId/text-message
const sendTextMessage = async (req, res) => {
  try {
    const userId = req.userId;
    const { teamId } = req.params;
    const { content } = req.body;

    const result = await teamService.sendTextMessage({ userId, teamId, content });

    if( result.success ) {
      return res.status(200).json(result);
    }
    return res.status(400).json(result);
  } catch (error) {
    res.status(error.status || 400);
    res.json(error);
  }
};

// [POST] /team/:teamId/image-message
const sendImageMessage = async (req, res) => {
  try {
    const userId = req.userId;
    const { teamId } = req.params;
    const image = req.file;

    const result = await teamService.sendImageMessage({ userId, teamId, image });

    if( result.success ) {
      return res.status(200).json(result);
    }
    return res.status(400).json(result);
  } catch (error) {
    res.status(error.status || 400);
    res.json(error);
  }
};

// [POST] /team/:teamId/file-message
const sendFileMessage = async (req, res) => {
  try {
    const userId = req.userId;
    const { teamId } = req.params;
    const file = req.file;

    const result = await teamService.sendFileMessage({ userId, teamId, file });

    if( result.success ) {
      return res.status(200).json(result);
    }
    return res.status(400).json(result);
  } catch (error) {
    res.status(error.status || 400);
    res.json(error);
  }
};

// [DELETE] /team/:teamId/messages/:messageId
const deleteMessage = async (req, res) => {
  try {
    const userId = req.userId;
    const { teamId, messageId } = req.params;

    const result = await teamService.deleteMessage({ userId, teamId, messageId });

    if( result.success ) {
      return res.status(200).json(result);
    }
    return res.status(400).json(result);
  } catch (error) {
    res.status(error.status || 400);
    res.json(error);
  }
};

module.exports = {
  getTeam,
  //getAllMembersOfTeam,
  getTeamMembersInfo,
  createTeam,
  getAllTeam,
  removeTeam,
  updateTeamDetail,
  getAllInvite,
  responseForInvite,
  addMoreInvite,
  getRecentTeamMessages,
  sendTextMessage,
  sendImageMessage,
  sendFileMessage,
  deleteMessage
};
