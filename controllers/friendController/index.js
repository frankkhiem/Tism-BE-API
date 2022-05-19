const friendService = require('../../services/friendService');

// [GET] /friends
const getListFriends = async (req, res) => {
  try {
    const userId = req.userId;
    
    const result = await friendService.getListFriends({ userId });

    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 400);
    res.json(error);
  }
};

// [GET] /friends/search?keyword=keyword
const searchFriends = async (req, res) => {
  try {
    const { keyword } = req.query;
    const userId = req.userId;
    
    const result = await friendService.searchFriends({ userId, keyword });

    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 400);
    res.json(error);
  }
};

// [GET] /friends/find?keyword=keyword
const findFriends = async (req, res) => {
  try {
    const { keyword } = req.query;
    const userId = req.userId;
    
    const result = await friendService.findFriends({ userId, keyword });

    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 400);
    res.json(error);
  }
};

// [GET] /friends/invitations-sended
const getInvitationSended = async (req, res) => {
  try {
    const userId = req.userId;

    const result = await friendService.getInvitationSended({ userId });

    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 400);
    res.json(error);
  }
};

// [GET] /friends/invitations-received
const getInvitationReceived = async (req, res) => {
  try {
    const userId = req.userId;

    const result = await friendService.getInvitationReceived({ userId });

    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 400);
    res.json(error);
  }
};

// [POST] /friends/invitation
const sendInvitationFriend = async (req, res) => {
  try {
    const { personId } = req.body;
    const userId = req.userId;

    const result = await friendService.sendInvitationFriend({ userId, personId });

    if( result.success ) {
      return res.status(200).json(result);
    } 

    return res.status(400).json(result);
  } catch (error) {
    res.status(error.status || 400);
    res.json(error);
  }
};

// [DELETE] /friends/invitation/:personId
const cancelInvitationFriend = async (req, res) => {
  try {
    const { personId } = req.params;
    const userId = req.userId;

    const result = await friendService.cancelInvitationFriend({ userId, personId });

    if( result.success ) {
      return res.status(200).json(result);
    } 

    return res.status(400).json(result);
  } catch (error) {
    res.status(error.status || 400);
    res.json(error);
  }
};

// [DELETE] /friends/invitation/:personId/decline
const declineInvitationFriend = async (req, res) => {
  try {
    const { personId } = req.params;
    const userId = req.userId;

    const result = await friendService.declineInvitationFriend({ userId, personId });

    if( result.success ) {
      return res.status(200).json(result);
    } 

    return res.status(400).json(result);
  } catch (error) {
    res.status(error.status || 400);
    res.json(error);
  }
};

// [POST] /friends
const acceptInvitationFriend = async (req, res) => {
  try {
    const { personId } = req.body;
    const userId = req.userId;

    const result = await friendService.acceptInvitationFriend({ userId, personId });

    if( result.success ) {
      return res.status(200).json(result);
    } 

    return res.status(400).json(result);
  } catch (error) {
    res.status(error.status || 400);
    res.json(error);
  }
};

// [DELETE] /friends/:friendId
const unFriend = async (req, res) => {
  try {
    const { friendId } = req.params;
    const userId = req.userId;

    const result = await friendService.unFriend({ userId, friendId });

    if( result.success ) {
      return res.status(200).json(result);
    } 

    return res.status(400).json(result);
  } catch (error) {
    res.status(error.status || 400);
    res.json(error);
  }
};

// [GET] /friends/person/:personId/info
const getPersonInfo = async (req, res) => {
  try {
    const { personId } = req.params;
    const userId = req.userId;

    const result = await friendService.getPersonInfo({ userId, personId });

    if( result.success ) {
      return res.status(200).json(result);
    } 

    return res.status(400).json(result);
  } catch (error) {
    res.status(error.status || 400);
    res.json(error);
  }
};

// [GET] /friends/person/:personId/mutual-friends
const getListMutualFriends = async (req, res) => {
  try {
    const { personId } = req.params;
    const userId = req.userId;

    const result = await friendService.getListMutualFriends({ userId, personId });

    return res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 400);
    res.json(error);
  }
};

module.exports = {
  getListFriends,
  searchFriends,
  findFriends,
  getInvitationSended,
  getInvitationReceived,
  sendInvitationFriend,
  cancelInvitationFriend,
  declineInvitationFriend,
  acceptInvitationFriend,
  unFriend,
  getPersonInfo,
  getListMutualFriends
}
