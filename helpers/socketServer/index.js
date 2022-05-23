const { Server } = require("socket.io");
const User = require('../../models/User');

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

    // change user status to 'offline' when all socket for userId disconnected
    socket.on("disconnect", async () => {
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
