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
    const result = await teamService.getTeam({
      teamId
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 400);
    res.json(error);
  }
};
//[POST] create new invite to friend

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
    const teamId = req.body.teamId;
    const teamName = req.body.teamName;
    const type = req.body.type;
    const is_private = req.body.is_private;
    const avatar = req.body.avatar;
    const result = await teamService.updateTeam({ teamId, teamName, type, is_private, avatar });

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
}

module.exports = {
  getTeam,
  createTeam,
  getAllTeam,
  removeTeam,
  updateTeamDetail,
  getAllInvite,
  responseForInvite,
  addMoreInvite
};
