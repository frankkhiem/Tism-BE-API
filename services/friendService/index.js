const createError = require("http-errors");

const User = require('../../models/User');
const { Friendship, FriendRequest, FriendMessage } = require('../../models/Friend');
const convertVie = require('../../helpers/convertVie');

const _getBasicDetailPerson = (person) => {
  return {
    id: person._id,
    name: person.fullname,
    email: person.email,
    avatar: person.avatar,
    status: person.status
  }
};

const _countMutualFriends = (user, person) => {
  let count = 0;
  const userFriendsId = user.friends;
  const personFriendsId = person.friends;

  userFriendsId.forEach((id) => {
    if( personFriendsId.includes(id) ) count++;
  });

  return count;
};

const _checkFriendship = async (user, person) => {
  try {
    const isFriend = await Friendship.findOne({
      $or: [
        {
          firstPerson: user._id,
          secondPerson: person._id
        },
        {
          firstPerson: person._id,
          secondPerson: user._id
        }
      ]
    });

    if( isFriend ) return 'friend';

    const isInvitationSender = await FriendRequest.findOne({
      inviter: user._id,
      invitee: person._id
    });

    if( isInvitationSender ) return 'invitation sended';

    const isInvitationReceiver = await FriendRequest.findOne({
      inviter: person._id,
      invitee: user._id
    });

    if( isInvitationReceiver) return 'invitation received';

    return 'stranger';
  } catch (error) {
    throw createError(error.statusCode || 500, error.message || 'Internal Server Error');
  }
};

const getListFriends = async ({ userId }) => {
  try {
    const user = await User.findById(userId);
    const friends = await User.find({
      _id: {
        $in: user.friends
      }
    });

    const result = [];

    for (const friend of friends) {
      const mutualFriends = _countMutualFriends(user, friend);
      const friendship = await Friendship.findOne({
        $or: [
          {
            firstPerson: user._id,
            secondPerson: friend._id
          },
          {
            firstPerson: friend._id,
            secondPerson: user._id
          }
        ]
      });
      const chatRoomId = friendship._id;
      const history = friendship.createdAt;
      result.push({
        ..._getBasicDetailPerson(friend),
        mutualFriends,
        history,
        chatRoomId
      });
    }

    result.sort((friend1, friend2) => {
      return friend1.history >= friend2.history ? -1 : 1;
    });

    return result;
  } catch (error) {
    throw createError(error.statusCode || 500, error.message || 'Internal Server Error');
  }
};

const searchFriends = async ({ userId, keyword }) => {
  try {
    const user = await User.findById(userId);

    const personsMatch = await User.find({
      _id: {
        $ne: userId
      },      
      $or: [
        {
          email: keyword,
        },
        {
          fullname: {
            $regex : `${keyword}`,
            $options: 'i'
          }
        },
        {
          normalizeName: {
            $regex : `${convertVie(keyword)}`,
            $options: 'i'
          }
        }
      ],
      friends: user._id
    });

    const result = [];

    for (const friend of personsMatch) {
      const mutualFriends = _countMutualFriends(user, friend);
      const friendship = await Friendship.findOne({
        $or: [
          {
            firstPerson: user._id,
            secondPerson: friend._id
          },
          {
            firstPerson: friend._id,
            secondPerson: user._id
          }
        ]
      });
      const chatRoomId = friendship._id;
      const history = friendship.createdAt.toLocaleDateString('en-GB');
      result.push({
        ..._getBasicDetailPerson(friend),
        mutualFriends,
        history,
        chatRoomId
      });
    }

    return result;
  } catch (error) {
    throw createError(error.statusCode || 500, error.message || 'Internal Server Error');
  }
};

const findFriends = async ({ userId, keyword }) => {
  try {
    const user = await User.findById(userId);

    const personsMatch = await User.find({
      _id: {
        $ne: userId
      },      
      $or: [
        {
          email: keyword,
        },
        {
          fullname: {
            $regex : `${keyword}`,
            $options: 'i'
          }
        },
        {
          normalizeName: {
            $regex : `${convertVie(keyword)}`,
            $options: 'i'
          }
        }
      ]
    });

    const result = [];

    for (const person of personsMatch) {
      const mutualFriends = _countMutualFriends(user, person);
      const friendship = await _checkFriendship(user, person);

      let chatRoomId = null;
      if( friendship === 'friend' ) {
        const chatRoom = await Friendship.findOne({
          $or: [
            {
              firstPerson: user._id,
              secondPerson: person._id
            },
            {
              firstPerson: person._id,
              secondPerson: user._id
            }
          ]
        });

        chatRoomId = chatRoom._id;
      }
      result.push({
        ..._getBasicDetailPerson(person),
        mutualFriends,
        friendship,
        chatRoomId
      });
    }

    return result;
  } catch (error) {
    throw createError(error.statusCode || 500, error.message || 'Internal Server Error');
  }
};

const getInvitationSended = async ({ userId }) => {
  try {
    const user = await User.findById(userId);

    const invitations = await FriendRequest.find({
      inviter: userId
    });

    let invitees = [];
    for (const invitation of invitations) {
      const invitee = await User.findById(invitation.invitee);
      const mutualFriends = _countMutualFriends(user, invitee);
      invitees.unshift({
        ..._getBasicDetailPerson(invitee),
        mutualFriends,
        createdAt: invitation.createdAt.toLocaleDateString('en-GB')
      })
    }

    return invitees;
  } catch (error) {
    throw createError(error.statusCode || 500, error.message || 'Internal Server Error');
  }
};

const getInvitationReceived = async ({ userId }) => {
  try {
    const user = await User.findById(userId);

    const invitations = await FriendRequest.find({
      invitee: userId
    });

    let inviters = [];
    for (const invitation of invitations) {
      const inviter = await User.findById(invitation.inviter);
      const mutualFriends = _countMutualFriends(user, inviter);
      inviters.unshift({
        ..._getBasicDetailPerson(inviter),
        mutualFriends,
        createdAt: invitation.createdAt.toLocaleDateString('en-GB')
      })
    }

    return inviters;
  } catch (error) {
    throw createError(error.statusCode || 500, error.message || 'Internal Server Error');
  }
};

const sendInvitationFriend = async ({ userId, personId }) => {
  try {
    const user = await User.findById(userId);
    const invitee = await User.findById(personId);

    if( invitee ) {
      const friendship = await _checkFriendship(user, invitee);
      if( friendship === 'stranger' ) {
        await FriendRequest.create({
          inviter: user._id,
          invitee: invitee._id
        });

        return {
          success: true,
          message: `Send invitation friend to ${invitee.email} successfully`
        }
      }
    }

    return {
      success: false,
      message: `Send invitation friend failed`
    }
  } catch (error) {
    throw createError(error.statusCode || 500, error.message || 'Internal Server Error');
  }
};

const cancelInvitationFriend = async ({ userId, personId }) => {
  try {
    const user = await User.findById(userId);
    const invitee = await User.findById(personId);

    if( invitee ) {
      const friendship = await _checkFriendship(user, invitee);
      if( friendship === 'invitation sended' ) {
        await FriendRequest.findOneAndDelete({
          inviter: user._id,
          invitee: invitee._id
        });

        return {
          success: true,
          message: `Cancel invitation friend to ${invitee.email} successfully`
        }
      }
    }

    return {
      success: false,
      message: `Cancel invitation friend failed`
    }
  } catch (error) {
    throw createError(error.statusCode || 500, error.message || 'Internal Server Error');
  }
};

const acceptInvitationFriend = async ({ userId, personId }) => {
  try {
    const user = await User.findById(userId);
    const inviter = await User.findById(personId);

    if( inviter ) {
      const friendship = await _checkFriendship(user, inviter);
      if( friendship === 'invitation received' ) {
        await FriendRequest.findOneAndDelete({
          inviter: inviter._id,
          invitee: user._id
        });

        await Friendship.create({
          firstPerson: user._id,
          secondPerson: inviter._id
        });

        user.friends.push(inviter._id);
        inviter.friends.push(user._id);
        await user.save();
        await inviter.save();

        return {
          success: true,
          message: `Accept invitation friend from ${inviter.email} successfully`
        }
      }
    }

    return {
      success: false,
      message: `Accept invitation friend failed`
    }
  } catch (error) {
    throw createError(error.statusCode || 500, error.message || 'Internal Server Error');
  }
};

const declineInvitationFriend = async ({ userId, personId }) => {
  try {
    const user = await User.findById(userId);
    const inviter = await User.findById(personId);

    if( inviter ) {
      const friendship = await _checkFriendship(user, inviter);
      if( friendship === 'invitation received' ) {
        await FriendRequest.findOneAndDelete({
          inviter: inviter._id,
          invitee: user._id
        });

        return {
          success: true,
          message: `Decline invitation friend from ${inviter.email} successfully`
        }
      }
    }

    return {
      success: false,
      message: `Decline invitation friend failed`
    }
  } catch (error) {
    throw createError(error.statusCode || 500, error.message || 'Internal Server Error');
  }
};

const unFriend = async ({ userId, friendId }) => {
  try {
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if( friend ) {
      const friendship = await _checkFriendship(user, friend);
      if( friendship === 'friend' ) {
        await Friendship.findOneAndDelete({
          $or: [
            {
              firstPerson: user._id,
              secondPerson: friend._id
            },
            {
              firstPerson: friend._id,
              secondPerson: user._id
            }
          ]
        });

        user.friends.splice(user.friends.indexOf(friend._id), 1);
        friend.friends.splice(friend.friends.indexOf(user._id), 1);
        await user.save();
        await friend.save();

        return {
          success: true,
          message: `UnFriend ${friend.email} successfully`
        }
      }
    }

    return {
      success: false,
      message: `UnFriend failed`
    }
  } catch (error) {
    throw createError(error.statusCode || 500, error.message || 'Internal Server Error');
  }
};

const getPersonInfo = async ({ userId, personId }) => {
  try {
    const user = await User.findById(userId);
    const person = await User.findById(personId);

    if( person ) {
      const mutualFriends = _countMutualFriends(user, person);
      const friendship = await _checkFriendship(user, person);

      let chatRoomId = null;
      if( friendship === 'friend' ) {
        const chatRoom = await Friendship.findOne({
          $or: [
            {
              firstPerson: user._id,
              secondPerson: person._id
            },
            {
              firstPerson: person._id,
              secondPerson: user._id
            }
          ]
        });

        chatRoomId = chatRoom._id;
      }

      return {
        ..._getBasicDetailPerson(person),
        friendship,
        mutualFriends,
        chatRoomId,
        success: true
      }
    }

    return {
      success: false,
      message: 'Get person information failed!'
    }
  } catch (error) {
    throw createError(error.statusCode || 500, error.message || 'Internal Server Error');
  }
};

const getListMutualFriends = async ({ userId, personId }) => {
  try {
    const user = await User.findById(userId);
    const person = await User.findById(personId);

    const result = [];

    if( person ) {
      const mutualFriendsId = user.friends.filter(id => person.friends.includes(id));

      const mutualFriends = await User.find({
        _id: {
          $in: mutualFriendsId
        }
      });

      for (const friend of mutualFriends) {
        const mutualFriends = _countMutualFriends(user, friend);
        const friendship = await Friendship.findOne({
          $or: [
            {
              firstPerson: user._id,
              secondPerson: friend._id
            },
            {
              firstPerson: friend._id,
              secondPerson: user._id
            }
          ]
        });
        const chatRoomId = friendship._id;
        const history = friendship.createdAt.toLocaleDateString('en-GB');
        result.push({
          ..._getBasicDetailPerson(friend),
          mutualFriends,
          history,
          chatRoomId
        });
      }
    }

    return result;
  } catch (error) {
    throw createError(error.statusCode || 500, error.message || 'Internal Server Error');
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
  acceptInvitationFriend,
  declineInvitationFriend,
  unFriend,
  getPersonInfo,
  getListMutualFriends
};
