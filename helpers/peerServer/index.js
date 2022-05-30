const { PeerServer } = require('peer');

const createPeerServer = (serverOptions = {
  port: 9000,
  path: '/tism/peer-server'
}) => {
  const peerServer = PeerServer(serverOptions);

  peerServer.on('connection', (client) => { 
    console.log('new peer client connected: ', client.id);
  });

  return peerServer;
}

module.exports = {
  createPeerServer
};
