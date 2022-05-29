const createError = require("http-errors");
const { translateAliases } = require("../../models/User");

const Team = require('../../models/Team');
const User = require('../../models/User');
const teamRequest = require('../../models/Team/team_request');
const Notification = require('../../models/notification');

const getAllTeam = async ({ user }) => {
  var allTeam = new Array();
  const teams = await Team.find({});
  teams.map(team => {
    if (team.member.includes(user._id)) {
      allTeam.push({ teamName: team.teamName, teamId: team._id, type: team.type, avatar: team.avatar })
    }
  })
  return allTeam;
}

////
const _getTeam = (team) => {
  return {
    teamId: team._id,
    teamName: team.teamName,
    type: team.type,
    is_private: team.is_private,
    avatar: team.avatar,
    //description: team.description,
    admin: team.admin,
    invites: team.invites,
    member: team.member,
  }
};
//
const _getTeamAdmin = async (team) => {
  const teamAdmin = await User.findById(team.admin)
  return {
    teamId: team._id,
    teamName: team.teamName,
    type: team.type,
    is_private: team.is_private,
    avatar: team.avatar,
    //description: team.description,
    admin: team.admin,
    invites: team.invites,
    member: team.member,
    adminName: teamAdmin.fullname,
    avatar: teamAdmin.avatar
  }
};

//get team's detail
const getTeam = async ({ teamId }) => {
  try {
    const team = await Team.findById(teamId);
    return await _getTeamAdmin(team);
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
  avatar,
  member,
  //invites,
  //description,
}) => {
  try {
    //const _invites = await transformInvite({inviteeArray: invites})
    //_admin = await User.findById(userId);
    admin = userId.toString();
    const newTeam = new Team({
      admin,
      teamName,
      type,
      is_private,
      avatar,
      member,
      //invites: _invites,
      //description,
    });
    const team = await newTeam.save();
    //console.log(team._id,team.invites)
    // if(inviteeArray == null) 
    // await inviteToAnyOne({ teamId: team._id, inviterId: team.admin, inviteeArray: _invites })

    return _getTeam(team);
  } catch (error) {
    throw createError(error.statusCode || 500, error.message);
  }
};

//update team's detail
const updateTeam = async ({ userId, teamId, teamName, type, is_private, avatar }) => {
  try {
    if (!await isAdmin({ teamId, userId })) return { status: 'not have permission' }
    const team = await Team.findById(teamId);

    team.teamName = teamName,
      team.type = type,
      team.is_private = is_private,
      team.avatar = avatar,
      await team.save();
    return {
      success: true,
      message: 'Update detail of team is successfully'
    };
  } catch (error) {
    throw createError(error.statusCode || 500, error.message);
  }
};

// is Team's Admin 
const isAdmin = async ({ teamId, userId }) => {
  const team = await Team.findById(teamId)
  if (team === null) return 0
  return team.admin == userId
}

//remove team
const removeTeam = async ({ teamId, userId }) => {
  try {
    if (await isAdmin({ teamId, userId })) {
      const team = await Team.findByIdAndRemove(teamId)
      return {
        success: true,
        message: 'Remove team is successfully'
      };
    }
    return { status: 'not have permission or not exist team' }
  }
  catch (error) {
    throw createError(error.statusCode || 500, error.message);
  }
}

//add member to team
const inviteMember = async ({ teamId, inviterId, inviteeId }) => {
  const team_request = new teamRequest({
    team: teamId,
    inviter: inviterId,
    invitee: inviteeId,
    accept: "false"
  })
  await team_request.save()
  //console.log('invitation added')
}

// // //invite from member's array 
// // const inviteMemberArray = async ({ teamId, inviterId, inviteeArray }) => {
// //   const team = await Team.findById(teamId)
// //   for (let i = 0; i < inviteeArray.length; i++) {
// //     await inviteMember({ teamId, inviterId, inviteeId: inviteeArray[i] })
// //   }
// }

// get all team's request for an user
const getAllInvite = async ({ userId }) => {
  try {
    const allInvite = await teamRequest.find({ 'invitee': userId, 'accept': 'false' })
    //console.log(inviteArray.length)
    return allInvite
  }
  catch (error) {
    throw createError(error.statusCode || 500, error.message);
  }
}

//response for invite 
const responseForInvite = async ({ userId, inviteId, accept }) => {
  try {
    const invite = await teamRequest.findById(inviteId)
    //console.log(invite)
    invite.accept = accept
    if (invite.accept == 'true') await ToMember({ teamId: invite.team, userId })
    await invite.save()
    return {
      success: true,
      message: 'response is success'
    }
  }
  catch (error) {
    throw createError(error.statusCode || 500, error.message);
  }
}

//To member when accept request from team
const ToMember = async ({ teamId, userId }) => {
  try {
    const team = await Team.findById(teamId)
    //console.log(team.member)
    team.member.push(userId)
    await team.save()
  }
  catch (error) {
    throw createError(error.statusCode || 500, error.message);
  }
}

// add more invite from team's admin
const addMoreInvite = async ({ teamId, userId, inviteeArray }) => {
  try {
    if (!await isAdmin({ teamId, userId })) return { status: 'not have permission' }
    const _invites = await transformInvite({ inviteeArray })
    await inviteToAnyOne({ teamId, userId, inviteeArray: _invites })
    const team = await Team.findById(teamId)
    return {
      success: true,
      message: 'Invite is sent'
    }//_getTeam(team);
  }
  catch (error) {
    throw createError(error.statusCode || 500, error.message);
  }
}
//invite to others
const inviteToAnyOne = async ({ teamId, userId, inviteeArray }) => {
  try {
    if (inviteeArray === null) return
    const team = await Team.findById(teamId)
    if (team.admin != userId) return "no permission"
    for (let i = 0; i < inviteeArray.length; i++) {
      if (!(team.member.includes(inviteeArray[i]) || (team.invites.includes(inviteeArray[i])))) {
        team.invites.push(inviteeArray[i])
        await inviteMember({ teamId, userId, inviteeId: inviteeArray[i] })
        await Notification.create({ title: team.name, content: "no msg", owner: userId, type_of_notification: { type: "Team Invite", teamId: teamId } })
      }
    }
    const newTeam = team.save()
    return newTeam
  }
  catch (error) {
    throw createError(error.statusCode || 500, error.message);
  }
}

//transform from mail string to id of user
const transformInvite = async ({ inviteeArray }) => {
  try {
    if (inviteeArray === null) return
    let temp = new Array()
    for (let i = 0; i < inviteeArray.length; i++) {
      var user = await User.findOne({ 'email': inviteeArray[i] })
      temp.push(user.id)
    }
    return temp
  }
  catch (error) {
    throw createError(error.statusCode || 500, error.message);
  }
}
module.exports = {
  _getTeam,
  getTeam,
  createTeam,
  getAllTeam,
  updateTeam,
  removeTeam,
  inviteMember,
  getAllInvite,
  responseForInvite,
  inviteToAnyOne,
  addMoreInvite
};