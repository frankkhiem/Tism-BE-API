const createError = require("http-errors");

const User = require('../../models/User');
const { Friendship, FriendRequest, FriendMessage } = require('../../models/Friend');

const getListConversations = async ({ userId }) => {
  try {
    const conversations = await Friendship.find({
      $or: [
        {
          firstPerson: userId
        },
        {
          secondPerson: userId
        }
      ]
    });

    let result = [];

    for (const conversation of conversations) {
      const conversationId = conversation._id;

      let isSeen;
      let friend;
      if( conversation.firstPerson.equals(userId) ) {
        friend = await User.findById(conversation.secondPerson);
        isSeen = conversation.firstPersonSeen;
      } else {
        friend = await User.findById(conversation.firstPerson);
        isSeen = conversation.secondPersonSeen;
      }
      const friendId = friend._id;
      const friendName = friend.fullname;
      const friendStatus = friend.status;
      const friendAvatar = friend.avatar;
      const lastFriendMessage = await FriendMessage.findOne({
        friendship: conversation._id
      }).sort({
        createdAt: -1
      }).limit(1);

      let lastMessage;
      let lastUpdated;
      if( lastFriendMessage ) {
        lastMessage = {
          type: lastFriendMessage.type,
          content: lastFriendMessage.content,
        };
        lastUpdated = lastFriendMessage.createdAt;
      } else {
        lastMessage = {
          type: 'text',
          content: 'Bạn mới!'
        };
        lastUpdated = conversation.createdAt;
      }

      const conversationInfo = {
        conversationId,
        isSeen,
        friendId,
        friendFullName: friendName,
        friendStatus,
        friendAvatar,
        lastMessage,
        lastUpdated
      };

      result.push(conversationInfo);
    }

    result = result.sort((item1, item2) => {
      if( item1.lastUpdated > item2.lastUpdated  ) return -1;
      else return 1;
    });

    return result;
  } catch (error) {
    throw createError(error.statusCode || 500, error.message || 'Internal Server Error');
  }
};

const getConversation = async ({ userId, conversationId }) => {
  try {
    const conversation = await Friendship.findOne({
      _id: conversationId,
      $or: [
        {
          firstPerson: userId
        }, 
        {
          secondPerson: userId
        }
      ]
    });

    if( conversation ) {
      const conversationId = conversation._id;

      let friend;
      if( conversation.firstPerson.equals(userId) ) {
        friend = await User.findById(conversation.secondPerson);
      } else {
        friend = await User.findById(conversation.firstPerson);
      }
      const friendId = friend._id;
      const friendFullName = friend.fullname;
      const friendStatus = friend.status;
      const friendAvatar = friend.avatar;

      const messages = await FriendMessage.find({
        friendship: conversationId
      });

      return {
        success: true,
        conversation: {
          conversationId,
          friendId,
          friendFullName,
          friendStatus,
          friendAvatar,
          messages
        }
      };
    }

    return {
      success: false,
      message: 'Get Conversation information failed!'
    };
  } catch (error) {
    throw createError(error.statusCode || 500, error.message || 'Internal Server Error');
  }
};

const sendTextMessage = async ({ userId, conversationId, content }) => {
  try {
    const conversation = await Friendship.findOne({
      _id: conversationId,
      $or: [
        {
          firstPerson: userId
        }, 
        {
          secondPerson: userId
        }
      ]
    });

    if( conversation ) {
      const friendId = conversation.firstPerson.equals(userId) ? conversation.secondPerson : conversation.firstPerson

      let newMessage = new FriendMessage({
        friendship: conversation._id,
        from: userId,
        to: friendId,
        type: 'text',
        content
      });

      await newMessage.save();

      if( conversation.firstPerson.equals(friendId) ) {
        conversation.firstPersonSeen = false;
      } else {
        conversation.secondPersonSeen = false;
      }

      await conversation.save();

      io.to(friendId.toString()).emit('new-message', newMessage);

      return {
        success: true,
        message: newMessage
      };
    }

    return {
      success: false,
      message: 'Send message to Conversation failed!'
    };
  } catch (error) {
  }
};

const seenConversation = async ({ userId, conversationId }) =>  {
  try {
    const conversation = await Friendship.findOne({
      _id: conversationId,
      $or: [
        {
          firstPerson: userId
        }, 
        {
          secondPerson: userId
        }
      ]
    });

    if( conversation ) {
      if( conversation.firstPerson.equals(userId) ) {
        conversation.firstPersonSeen = true;
      } else {
        conversation.secondPersonSeen = true;
      }

      await conversation.save();

      return {
        success: true,
        message: 'Mark seen tag for conversation successfully'
      };
    }

    return {
      success: false,
      message: 'Mark seen tag for conversation failed!'
    };
  } catch (error) {
    throw createError(error.statusCode || 500, error.message || 'Internal Server Error');
  }
};

module.exports = {
  getListConversations,
  getConversation,
  sendTextMessage,
  seenConversation
}
