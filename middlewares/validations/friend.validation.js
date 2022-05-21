const searchFriends = (req, res, next) => {
  const { keyword } = req.query;
  if( !keyword.trim() ) {
    return res.status(400).json({
      success: false,
      message: 'keyword is required in request query'
    });
  }
  next();
};

const sendInvitationFriend = (req, res, next) => {
  const { personId } = req.body;
  if( !personId ) {
    return res.status(400).json({
      success: false,
      message: 'personId is the identifier of the person you want to be friends with and personId is required in body'
    });
  }
  if( req.userId == personId ) {
    return res.status(400).json({
      success: false,
      message: 'personId cannot be the same as userId'
    });
  }
  next();
}

const cancelInvitationFriend = (req, res, next) => {
  const { personId } = req.params;
  if( !personId ) {
    return res.status(400).json({
      success: false,
      message: 'personId is the identifier of the person you want to cancel the friends invitation and personId is required in path parameter'
    });
  }
  if( req.userId == personId ) {
    return res.status(400).json({
      success: false,
      message: 'personId cannot be the same as userId'
    });
  }
  next();
}

const acceptInvitationFriend =  (req, res, next) => {
  const { personId } = req.body;
  if( !personId ) {
    return res.status(400).json({
      success: false,
      message: 'personId is the identifier of the person you want accept the friends invitation and personId is required body'
    });
  }
  if( req.userId == personId ) {
    return res.status(400).json({
      success: false,
      message: 'personId cannot be the same as userId'
    });
  }
  next();
}

const unFriend = (req, res, next) => {
  const { friendId } = req.params;
  if( !friendId ) {
    return res.status(400).json({
      success: false,
      message: 'friendId is the identifier of the person you want unfriend and friendId is required in path parameter'
    });
  }
  if( req.userId == friendId ) {
    return res.status(400).json({
      success: false,
      message: 'friendId cannot be the same as userId'
    });
  }
  next();
}

const getPersonInfo = (req, res, next) => {
  const { personId } = req.params;
  if( !personId ) {
    return res.status(400).json({
      success: false,
      message: 'personId is the identifier of the person you want get information and personId is required in path parameter'
    });
  }
  if( req.userId == personId ) {
    return res.status(400).json({
      success: false,
      message: 'personId cannot be the same as userId'
    });
  }
  next();
}

module.exports = {
  searchFriends,
  sendInvitationFriend,
  cancelInvitationFriend,
  acceptInvitationFriend,
  unFriend,
  getPersonInfo
}
