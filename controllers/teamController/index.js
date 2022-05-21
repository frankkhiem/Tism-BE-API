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

//[POST] create new team 
const createTeam = async (req, res) => {
  try {
    const userId = req.userId;
    const teamName = req.body.teamName;
    const type = req.body.type;
    const is_private = req.body.is_private;
    let temp = req.body.member;
    temp.push(userId);
    const member = temp;
    const description = req.body.description;
    console.log(userId, teamName, type, description, created_date)
    const result = await teamService.createTeam({ 
      userId,
      //admin,
      teamName,
      type,
      is_private,
      member,
      description,
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
    const description = req.body.description;
    const result = await teamService.updateTeam({ teamId, teamName, type, is_private, description});

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
    const { userId } = req.userId;
    const result = await teamService.removeTeam({ teamId, userId });

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
  createTeam,
  getAllTeam,
  updateTeamDetail
};
