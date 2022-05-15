const { response } = require('express');
const teamService = require('../../services/teamService');

// [GET] /allteams
// const getAllTeam = async (req, res) => {
//   try {
//     const userId = req.userId;

//     const result = await teamService._getTeam({ 
//       userId,
//       //admin,
//       teamName,
//       is_private,
//       member,
//       description,
//       created_date,
//      });

//     res.status(200).json(result);
//   } catch (error) {
//     res.status(error.status || 400);
//     res.json(error);
//   }
// }
// [GET] /team
const getTeam = async (req, res) => {
  try {
    const userId = req.userId;
    const teamName = req.teamName;
    const type = req.is_private;
    const member = req.member;
    const description = req.description;
    const created_date = req.created_date;
    const admin = req.userId
    const result = await teamService._getTeam({ 
      userId,
      //admin,
      teamName,
      is_private,
      member,
      description,
      created_date,
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
    const member = req.body.member;
    const description = req.body.description;
    const created_date = Date.now();
    console.log(userId, teamName, type, description, created_date)
    const result = await teamService.createTeam({ 
      userId,
      //admin,
      teamName,
      type,
      is_private,
      member,
      description,
      created_date,
    });
    console.log(userId, teamName, type, description, created_date)
    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 400);
    res.json(error);
  }
};

module.exports = {
  getTeam,
  createTeam,
  //updateUsername
};
