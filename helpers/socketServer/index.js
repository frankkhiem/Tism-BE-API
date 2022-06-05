const { Server } = require("socket.io");
const User = require('../../models/User');
const { Friendship, FriendMessage } = require('../../models/Friend');
const userService = require('../../services/userService');

const _createVideoCallMessage = async (callInfo) => {
  try {
    const videoCallMessage = new FriendMessage({
      friendship: callInfo.conversationId,
      from: callInfo.caller,
      to: callInfo.receiver,
      type: 'video-call',
      content: 'Tạo',
      description: 'initial'
    });

    const conversation = await Friendship.findById(callInfo.conversationId);
    conversation.firstPersonSeen = false;
    conversation.secondPersonSeen = false;

    await videoCallMessage.save();
    await conversation.save();
    return videoCallMessage._id;
  } catch (error) {
    console.log(error);
  }
};

const _updateVideoCallMessage = async ({ callInfo, content, description }) => {
  if( !callInfo.callId ) return null;
  try {
    let videoCallMessage = await FriendMessage.findById(callInfo.callId);
    videoCallMessage.content = content;
    videoCallMessage.description = description;

    await videoCallMessage.save();
    return videoCallMessage;
  } catch (error) {
    console.log(error);
  }
}

const createSocketServer = ({ 
  httpServer,
  serverOptions = {
    cors: {
      origin: "*"
    }
  }
}) => {
  const io = new Server(httpServer, serverOptions);

  io.use(async (socket, next) => {
    const userId = socket.handshake.auth.userId;
    if( !userId ) {
      return next(new Error("Unauthorized"));
    }

    const user = await User.findById(userId);
    if( !user ) {
      return next(new Error("Unauthorized"));
    }

    socket.userId = userId;
    next();
  });

  io.on("connection", async (socket) => {
    console.log('new socket client connected: ' + socket.userId);

    // join socket in the "userId" room
    socket.join(socket.userId);
    console.log(socket.rooms);
    
    const user = await User.findById(socket.userId);
    // change user status to 'online' when socket connected
    if( user.status === 'offline' ) {
      user.status = 'online';
      await user.save();

      const friendsRoom = user.friends.map(id => id.toString());
      if( friendsRoom.length > 0 ) {
        // emit friend-online event to all friends of the user
        socket.to(friendsRoom).emit('friend-online', { id: user._id })
      }
    }

    // receive a request to initial a video call
    socket.on('init-video-call', async (callInfo) => {
      try {
        const callId = await _createVideoCallMessage(callInfo);
        await userService.updateStatus({ userId: callInfo.caller, status: 'busy' });
        await userService.updateStatus({ userId: callInfo.receiver, status: 'busy' });
        socket.emit('created-video-call', {
          callId,
          ...callInfo
        });
        socket.to(callInfo.receiver).emit('incoming-video-call', {
          callId,
          ...callInfo
        });
      } catch (error) {
        console.log(error);
      }
    });

    // reject incoming video call
    socket.on('reject-video-call', async (callInfo, error = false) => {
      try {
        socket.to(callInfo.caller).emit('reject-video-call', callInfo);
        const newMessage = await _updateVideoCallMessage({
          callInfo,
          content: 'Từ chối',
          description: 'reject'
        });

        await userService.updateStatus({ userId: callInfo.caller, status: 'online' });
        if( !error ) {
          await userService.updateStatus({ userId: callInfo.receiver, status: 'online' });
        }
        // console.log( 'tu choi: ', callInfo );
        if( newMessage ) {
          io.to([ callInfo.caller, callInfo.receiver ]).emit('new-message', newMessage);
        }
      } catch (error) {
        console.log(error);
      }
    });

    // accept incoming video call
    socket.on('accept-video-call', async (callInfo) => {
      try {
        socket.to(callInfo.caller).emit('accept-video-call', callInfo);
        const newMessage = await _updateVideoCallMessage({
          callInfo,
          content: 'Chấp nhận',
          description: 'accept'
        });
      } catch (error) {
        console.log(error);
      }
    });

    // cancel video call
    socket.on('cancel-video-call', async (callInfo, error = false) => {
      try {
        socket.to(callInfo.receiver).emit('cancel-video-call', callInfo);
        const newMessage = await _updateVideoCallMessage({
          callInfo,
          content: 'Hủy bỏ',
          description: 'cancel'
        });

        if( !error ) {
          await userService.updateStatus({ userId: callInfo.caller, status: 'online' });
        }
        await userService.updateStatus({ userId: callInfo.receiver, status: 'online' });
        if( newMessage ) {         
          io.to([ callInfo.caller, callInfo.receiver ]).emit('new-message', newMessage);
        }
      } catch (error) {
        console.log(error);
      }
    });

    // end video call from caller
    socket.on('end-video-call-from-receiver', async (callInfo, error = false) => {
      try {
        socket.to(callInfo.caller).emit('end-video-call', callInfo);
        const newMessage = await _updateVideoCallMessage({
          callInfo,
          content: callInfo.duringTimes,
          description: 'success'
        });

        if( !error ) {
          await userService.updateStatus({ userId: callInfo.caller, status: 'online' });
        }
        await userService.updateStatus({ userId: callInfo.receiver, status: 'online' });
        if( newMessage ) {
          io.to([ callInfo.caller, callInfo.receiver ]).emit('new-message', newMessage);
        }
      } catch (error) {
        console.log(error);
      }
    });

    // end video call from caller
    socket.on('end-video-call-from-caller', async (callInfo, error = false) => {
      try {
        socket.to(callInfo.receiver).emit('end-video-call', callInfo);
        const newMessage = await _updateVideoCallMessage({
          callInfo,
          content: callInfo.duringTimes,
          description: 'success'
        });
        
        await userService.updateStatus({ userId: callInfo.caller, status: 'online' });
        if( !error ) {
          await userService.updateStatus({ userId: callInfo.receiver, status: 'online' });
        }
        if( newMessage ) {
          io.to([ callInfo.caller, callInfo.receiver ]).emit('new-message', newMessage);
        }
      } catch (error) {
        console.log(error);
      }
    });

    // handle join team meeting
    socket.on('join-team-meeting', (data) => {
      // console.log(data);
      socket.join(data.meetingId);
      socket.to(data.meetingId).emit('new-member-connected', data);
    });

    // handle leave team meeting
    socket.on('leave-team-meeting', (data) => {
      // console.log(data);
      // handle when team's member leave team meeting
    });


    // change user status to 'offline' when all socket for userId disconnected
    socket.on('disconnect', async () => {
      try {
        console.log('socket client disconnected: ' + socket.id);
        const countSockets = await io.in(socket.userId).allSockets();
        const isDisconnected = countSockets.size === 0;
        if( isDisconnected ) {
          // update the user status
          const user = await User.findById(socket.userId);
          user.status = 'offline';
          await user.save();

          const friendsRoom = user.friends.map(id => id.toString());
          if( friendsRoom.length > 0 ) {
            // emit friend-offline event to all friends of the user
            socket.to(friendsRoom).emit('friend-offline', { id: user._id });
          }
        }
      } catch (error) {
        console.log(error);
      }
    });
  });

  return io;
};

module.exports = {
  createSocketServer
};
