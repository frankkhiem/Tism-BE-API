const createError = require("http-errors");

const Team = require('../../models/Team');
const User = require('../../models/User');
//get team's detail
const _getTeam = (team) => {
    return {
      teamId: team._id,
      teamName: team.name,
      type: team.is_private,
      description: team.description,
      admin: team.admin,
      member: team.member,
      created_date: team.created_date
    }
};

const getTeam= async ({ teamId }) => {
  try {
    const team = await Team.findById(teamId);

    return _getTeam(team);
  } catch (error) {
    throw createError(error.statusCode || 500, error.message);
  }
};

const createTeam = async ({
  userId,
  teamName,
  type,
  is_private,
  member,
  description,
  created_date}) => {
  try {
    admin = await User.findById(userId);
    member = admin;
    const newTeam = new Team({
      admin,
      teamName,
      type,
      is_private,
      member,
      description,
      created_date
    });
    const team = await newTeam.save();
    return _getTeam(team);
  } catch (error) {
    throw createError(error.statusCode || 500, error.message);
  }
};

module.exports = {
  _getTeam,
  createTeam
};

