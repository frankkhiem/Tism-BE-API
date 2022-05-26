const { Server } = require("socket.io");
const User = require('../../models/User');
const { Friendship, FriendMessage } = require('../../models/Friend')

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
    }

    const friendsRoom = user.friends.map(id => id.toString());
    if( friendsRoom.length > 0 ) {
      // emit friend-online event to all friends of the user
      socket.to(friendsRoom).emit('friend-online', { id: user._id })
    }

    // receive a request to initial a video call
    socket.on('init-video-call', async (callInfo) => {
      const callId = await _createVideoCallMessage(callInfo);
      socket.emit('created-video-call', {
        callId,
        ...callInfo
      });
      socket.to(callInfo.receiver).emit('incoming-video-call', {
        callId,
        ...callInfo
      });
    });

    // reject incoming video call
    socket.on('reject-video-call', async (callInfo) => {
      try {
        socket.to(callInfo.caller).emit('reject-video-call', callInfo);
        const newMessage = await _updateVideoCallMessage({
          callInfo,
          content: 'Từ chối',
          description: 'reject'
        });
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
    socket.on('cancel-video-call', async (callInfo) => {
      try {
        socket.to(callInfo.receiver).emit('cancel-video-call', callInfo);
        const newMessage = await _updateVideoCallMessage({
          callInfo,
          content: 'Hủy bỏ',
          description: 'cancel'
        });

        if( newMessage ) {         
          io.to([ callInfo.caller, callInfo.receiver ]).emit('new-message', newMessage);
        }
      } catch (error) {
        console.log(error);
      }
    });

    // end video call from caller
    socket.on('end-video-call-from-receiver', async (callInfo) => {
      try {
        socket.to(callInfo.caller).emit('end-video-call', callInfo);
        const newMessage = await _updateVideoCallMessage({
          callInfo,
          content: callInfo.duringTimes,
          description: 'success'
        });

        if( newMessage ) {
          io.to([ callInfo.caller, callInfo.receiver ]).emit('new-message', newMessage);
        }
      } catch (error) {
        console.log(error);
      }
    });

    // end video call from caller
    socket.on('end-video-call-from-caller', async (callInfo) => {
      try {
        socket.to(callInfo.receiver).emit('end-video-call', callInfo);
        const newMessage = await _updateVideoCallMessage({
          callInfo,
          content: callInfo.duringTimes,
          description: 'success'
        });

        if( newMessage ) {
          io.to([ callInfo.caller, callInfo.receiver ]).emit('new-message', newMessage);
        }
      } catch (error) {
        console.log(error);
      }
    });

    // change user status to 'offline' when all socket for userId disconnected
    socket.on('disconnect', async () => {
      console.log('socket client disconnected: ' + socket.id);
      const countSockets = await io.in(socket.userId).allSockets();
      const isDisconnected = countSockets.size === 0;
      if (isDisconnected) {
        // update the user status
        user.status = 'offline';
        await user.save();
      }
      const friendsRoom = user.friends.map(id => id.toString());
      if( friendsRoom.length > 0 ) {
        // emit friend-offline event to all friends of the user
        socket.to(friendsRoom).emit('friend-offline', { id: user._id });
      }
    });
  });

  return io;
};

module.exports = {
  createSocketServer
}
