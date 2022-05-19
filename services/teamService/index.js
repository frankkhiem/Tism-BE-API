const createError = require("http-errors");

const Team = require('../../models/Team');
const User = require('../../models/User');


const AllTeam = async ({ user }) => {
  var allTeam = new Array();
  const teams = await Team.find({});
  teams.map(team => {
    if (team.member.includes(user._id)) {
      allTeam.push({ teamName: team.teamName, teamId: team._id })
    }
    console.log(allTeam, "\n")
  })
  console.log(allTeam)
  return allTeam;
}

////
const _getTeam = (team) => {
  return {
    teamId: team._id,
    teamName: team.teamName,
    type: team.is_private,
    description: team.description,
    admin: team.admin,
    member: team.member,
  }
};

//get team's detail
const getTeam = async ({ teamId }) => {
  try {
    const team = await Team.findById(teamId);
    return _getTeam(team);
  } catch (error) {
    throw createError(error.statusCode || 500, error.message);
  }
};

// create new team
const createTeam = async ({
  userId,
  teamName,
  type,
  is_private,
  member,
  description,
}) => {
  try {
    _admin = await User.findById(userId);
    admin = _admin._id
    temp = [{ admin }]
    //member = temp
    //member.concat(admin)
    const newTeam = new Team({
      admin,
      teamName,
      type,
      is_private,
      member,
      description,
    });
    const team = await newTeam.save();
    console.log(admin)
    return _getTeam(team);
  } catch (error) {
    throw createError(error.statusCode || 500, error.message);
  }
};

//update team's detail
const updateTeam = async ({ teamId, teamName, type, is_private, description }) => {
  try {
    const team = await Team.findById(teamId);

    team.teamName = teamName,
    team.type = type,
    team.is_private = is_private,
    team.description = description,

    await team.save();
    return {
      success: true,
      message: 'Update detail of team is successfully'
    };
  } catch (error) {
    throw createError(error.statusCode || 500, error.message);
  }
};

module.exports = {
  _getTeam,
  getTeam,
  createTeam,
  AllTeam,
  updateTeam
};

