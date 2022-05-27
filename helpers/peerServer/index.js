const { PeerServer } = require('peer');

const createPeerServer = (serverOptions = {
  port: 9000,
  path: '/tism/peer-server'
}) => {
  const peerServer = PeerServer(serverOptions);

  return peerServer;
}

module.exports = {
  createPeerServer
};
