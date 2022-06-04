const createError = require("http-errors");
const { translateAliases } = require("../../models/User");

const Team = require('../../models/Team');
const User = require('../../models/User');
const teamRequest = require('../../models/Team/team_request');
//const Notification = require('../../models/notification');
const TeamMessage = require('../../models/Team/team.message');
const Notification = require('../../models/notification');
const fs = require('fs');
const { uploadToFirebase } = require('../../helpers/firebase/storage');

const getAllTeam = async ({ user }) => {
  try {
    let allTeam = new Array();
    const teams = await Team.find({});
    teams.map(team => {
      if (team.member.includes(user._id)) {
        allTeam.push({ teamName: team.teamName, teamId: team._id, type: team.type, avatar: team.avatar })
      }
    })
    return allTeam;
  } catch (error) {
    throw createError(error.statusCode || 500, error.message);
  }
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
    adminAvatar: teamAdmin.avatar
  }
};

//get team's detail
const getTeam = async ({ teamId, userId }) => {
  try {
    const team = await Team.findById(teamId);
    if(!team.member.includes(userId.toString())) return {success: "false"}
    return await _getTeamAdmin(team);
  } catch (error) {
    throw createError(error.statusCode || 500, error.message);
  }
};

// //get all member of team
// const getAllMembersOfTeam = async ({ teamId }) => {
//   try {
//     const team = await Team.findById(teamId);
//     return {members: team.member};
//   } catch (error) {
//     throw createError(error.statusCode || 500, error.message);
//   }
// };
const getTeamMembersInfo = async ({ teamId }) => {
  try {
    const team = await Team.findById(teamId);
    const members = team.member;

    let result = [];
    for (const memberId of members) {
      const member = await User.findById(memberId);
      if( member ) {
        const memberInfo = {
          id: member._id,
          name: member.fullname,
          email: member.email,
          avatar: member.avatar,
          status: member.status
        }

        result.push(memberInfo);
      }
    }

    return result;
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
  try {
    const team_request = new teamRequest({
      team: teamId,
      inviter: inviterId,
      invitee: inviteeId,
      accept: ""
    })
    await team_request.save();
    const inviter = await User.findById(inviterId);
    const team = await Team.findById(teamId);
    // send realtime notification to invitee
    io.to(inviteeId).emit('new-invitation-team', {
      inviter: inviter.fullname,
      inviterAvatar: inviter.avatar,
      teamName: team.teamName
    });
  } catch (error) {
    throw createError(error.statusCode || 500, error.message);
  }
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
    const allInvite = await teamRequest.find({ 'invitee': userId, 'accept': '' })
    //console.log(inviteArray.length)
    let inviteArray = new Array()
    for(let i=0; i < allInvite.length; i++){
      let team = await Team.findById(allInvite[i].team)
      let user = await User.findById(team.admin)
      inviteArray.push({inviteId: allInvite[i]._id, teamId: allInvite[i].team, accept:allInvite[i].accept ,teamName: team.teamName, adminName: user.fullname, created_date:allInvite[i].createdAt})
    }
    return inviteArray
  }
  catch (error) {
    throw createError(error.statusCode || 500, error.message);
  }
}

//response for invite 
const responseForInvite = async ({ userId, inviteId, accept }) => {
  try {
    const invite = await teamRequest.findById(inviteId)

    if (invite.invitee.toString() != userId.toString()) return "not have permission"

    invite.accept = accept
    await invite.save()
    if (invite.accept != '') {
      if(accept == 'true')
        await ToMember({ teamId: invite.team, userId })// them vao member khi dong y vao team
      const team = await Team.findById(invite.team)
      let index = team.invites.indexOf(userId.toString())
      if(index > -1) {
        team.invites.splice(index, 1)// xoa user khoi invite khi ho dong y
        await team.save()
      }
    }

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
    if(!team.member.includes(userId)) team.member.push(userId)
    await team.save()
  }
  catch (error) {
    throw createError(error.statusCode || 500, error.message);
  }
}

// add more invite from team's admin
const addMoreInvite = async ({ teamId, userId, inviteeArray }) => {
  try {
    const team = await Team.findById(teamId)
    if (!await isAdmin({ teamId, userId })) return { status: 'not have permission' }

    const _invites = await transformInvite({ inviteeArray })

    if(team.invites.includes(_invites[0]) || team.member.includes(_invites[0])) return "already in member or invites"
    
    await inviteToAnyOne({ teamId, userId, inviteeArray: _invites })

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
    if (team.admin != userId) return "no have permission"
    for (let i = 0; i < inviteeArray.length; i++) {
      if (!(team.member.includes(inviteeArray[i]) || (team.invites.includes(inviteeArray[i])))) {
        team.invites.push(inviteeArray[i])
        await inviteMember({ teamId, inviterId: userId, inviteeId: inviteeArray[i] })
        //await Notification.create({ title: team.name, content: "no msg", owner: userId, type_of_notification: { type: "Team Invite", teamId: teamId } })
      }
      else{
        return "user already exist in team"
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
};

const getRecentTeamMessages = async ({ userId, teamId, skip, take }) => {
  try {
    const team = await Team.findOne({
      _id: teamId,
      member: userId
    });

    if( team ) {
      const totalMessages = await TeamMessage.countDocuments({
        team: teamId
      });
      let messages = await TeamMessage.find({
        team: teamId
      }).limit(take).skip(skip).sort({ createdAt: -1 });

      for(let i = 0; i < messages.length; i++) {
        const sender = await User.findById(messages[i].from);
        messages[i] = {
          ...messages[i]._doc,
          senderName: sender?.fullname,
          senderAvatar: sender?.avatar
        }        
      }

      return {
        success: true,
        totalMessages,
        messages: messages.reverse()
      };
    }

    return {
      success: false,
      message: 'Get Team\'s messages failed!'
    };
  } catch (error) {
    throw createError(error.statusCode || 500, error.message || 'Internal Server Error');
  }
}

const sendTextMessage = async ({ userId, teamId, content }) => {
  try {
    const team = await Team.findOne({
      _id: teamId,
      member: userId
    });

    if( team ) {
      let newMessage = new TeamMessage({
        team: team._id,
        from: userId,
        type: 'text',
        content
      });

      await newMessage.save();      
      const sender = await User.findById(userId);
      const message = {
        ...newMessage._doc,
        senderName: sender.fullname,
        senderAvatar: sender.avatar
      };

      io.to(team.member).except(userId.toString()).emit('new-team-message', message);

      return {
        success: true,
        message
      };
    }

    return {
      success: false,
      message: 'Send message to Team failed!'
    };
  } catch (error) {
  }
};

const sendImageMessage = async ({ userId, teamId, image }) => {
  try {
    const team = await Team.findOne({
      _id: teamId,
      member: userId
    });

    if( team ) {
      let newMessage = new TeamMessage({
        team: team._id,
        from: userId,
        type: 'image'
      });

      const uploadUrls = await uploadToFirebase(
        image.path, 
        `uploads/teams/${teamId}/chat`,
        image.filename
      );

      newMessage.content = uploadUrls.url;
      newMessage.description = uploadUrls.urlDownload;

      await newMessage.save();
      const sender = await User.findById(userId);
      const message = {
        ...newMessage._doc,
        senderName: sender.fullname,
        senderAvatar: sender.avatar
      };

      io.to(team.member).except(userId.toString()).emit('new-team-message', message);

      return {
        success: true,
        message
      };
    }

    return {
      success: false,
      message: 'Send message to Team failed!'
    };
  } catch (error) {
    throw createError(error.statusCode || 500, error.message || 'Internal Server Error');
  } finally {
    // Xóa file ở tmp/ kể cả thành công hay gặp lỗi
    fs.unlink(image.path, (error) => {
      if( error ) {
        throw error;
      }
    });
  }
};

const sendFileMessage = async ({ userId, teamId, file }) => {
  try {
    const team = await Team.findOne({
      _id: teamId,
      member: userId
    });

    if( team ) {
      let newMessage = new TeamMessage({
        team: team._id,
        from: userId,
        type: 'file'
      });

      const uploadUrls = await uploadToFirebase(
        file.path, 
        `uploads/teams/${teamId}/chat`,
        file.filename
      );

      newMessage.content = file.originalname;
      newMessage.description = uploadUrls.urlDownload;

      await newMessage.save();
      const sender = await User.findById(userId);
      const message = {
        ...newMessage._doc,
        senderName: sender.fullname,
        senderAvatar: sender.avatar
      };

      io.to(team.member).except(userId.toString()).emit('new-team-message', message);

      return {
        success: true,
        message
      };
    }

    return {
      success: false,
      message: 'Send message to Team failed!'
    };
  } catch (error) {
    throw createError(error.statusCode || 500, error.message || 'Internal Server Error');
  } finally {
    // Xóa file ở tmp/ kể cả thành công hay gặp lỗi
    fs.unlink(file.path, (error) => {
      if( error ) {
        throw error;
      }
    });
  }
};

const createTeamMeeting = async ({ userId, teamId, meetingName }) => {
  try {
    const team = await Team.findOne({
      _id: teamId,
      member: userId
    });

    if( team ) {
      let newMessage = new TeamMessage({
        team: team._id,
        from: userId,
        type: 'meeting',
        content: meetingName != '' ? meetingName : 'Cuộc họp nhóm',
        description: 'happening'
      });

      await newMessage.save();      
      const sender = await User.findById(userId);
      const message = {
        ...newMessage._doc,
        senderName: sender.fullname,
        senderAvatar: sender.avatar
      };

      io.to(team.member).emit('new-team-meeting', message);

      return {
        success: true,
        message
      };
    }

    return {
      success: false,
      message: 'Create Team meeting failed!'
    };
  } catch (error) {
    throw createError(error.statusCode || 500, error.message || 'Internal Server Error');
  }
};

const checkMeetingPermissionAccess = async ({ userId, meetingId }) => {
  try {
    const meeting = await TeamMessage.findById(meetingId);
    if( meeting && meeting.type === 'meeting' && meeting.description === 'happening' ) {
      const team = await Team.findOne({
        id: meeting.team,
        member: userId
      });

      if( team ) {
        return {
          success: true,
          isOwner: meeting.from.equals(userId) ? true : false,
          meetingName: meeting.content,
          meesage: 'User having permission to access meeting'
        };
      }
    }

    return {
      success: false,
      meesage: 'User have not permission to access meeting'
    }
  } catch (error) {
    throw createError(error.statusCode || 500, error.message || 'Internal Server Error');
  }
};

const endTeamMeeting = async ({ userId, meetingId, duringTimes }) => {
  try {
    const meeting = await TeamMessage.findOne({
      _id: meetingId,
      from: userId
    });

    if( meeting ) {
      meeting.content = duringTimes;
      meeting.description = 'finished';

      await meeting.save(); 
      const team = await Team.findById(meeting.team);
      const sender = await User.findById(userId);
      const message = {
        ...meeting._doc,
        senderName: sender.fullname,
        senderAvatar: sender.avatar
      };

      io.to(team.member).emit('end-team-meeting', message);
      io.to(meeting._id).emit('end-team-meeting', message);

      return {
        success: true,
        message
      };
    }

    return {
      success: false,
      message: 'End Team meeting failed!'
    };
  } catch (error) {
    throw createError(error.statusCode || 500, error.message || 'Internal Server Error');
  }
};

const deleteMessage = async ({ userId, teamId, messageId }) => {
  try {
    const team = await Team.findById(teamId);
    const deletedMessage = await TeamMessage.findOneAndDelete({
      _id: messageId,
      team: team._id,
      from: userId
    });

    if( deletedMessage ) {
      io.to(team.member).except(userId.toString()).emit('deleted-team-message', deletedMessage);
      
      return {
        success: true,
        deletedMessage
      };
    }

    return {
      success: false,
      message: 'Delete team message failed!'
    };
  } catch (error) {
    throw createError(error.statusCode || 500, error.message || 'Internal Server Error');
  }
};

module.exports = {
  _getTeam,
  getTeam,
  //getAllMembersOfTeam,
  getTeamMembersInfo,
  createTeam,
  getAllTeam,
  updateTeam,
  removeTeam,
  inviteMember,
  getAllInvite,
  responseForInvite,
  inviteToAnyOne,
  addMoreInvite,
  getRecentTeamMessages,
  sendTextMessage,
  sendImageMessage,
  sendFileMessage,
  createTeamMeeting,
  checkMeetingPermissionAccess,
  endTeamMeeting,
  deleteMessage
};
