const createError = require("http-errors");

const User = require('../../models/User');
const { Friendship, FriendRequest, FriendMessage } = require('../../models/Friend');
const fs = require('fs');
const { uploadToFirebase } = require('../../helpers/firebase/storage');

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

      let lastMessage = {};
      let lastUpdated;
      if( lastFriendMessage ) {
        lastMessage.type = lastFriendMessage.type;
        if( lastFriendMessage.type === 'image' ) {
          lastMessage.content = 'Ảnh gửi lên.';
        } else if( lastFriendMessage.type === 'file' ) {
          lastMessage.content = 'Tệp đính kèm.';
        } else if( lastFriendMessage.type === 'video-call' ) {
          lastMessage.content = 'Cuộc gọi Video.';
        } else {
          lastMessage.content = lastFriendMessage.content
        }
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

      const totalMessages = await FriendMessage.countDocuments({
        friendship: conversationId
      });
      const messages = await FriendMessage.find({
        friendship: conversationId
      }).limit(10).sort({ createdAt: -1 });

      return {
        success: true,
        conversation: {
          conversationId,
          friendId,
          friendFullName,
          friendStatus,
          friendAvatar,
          totalMessages,
          messages: messages.reverse()
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

const sendImageMessage = async ({ userId, conversationId, image }) => {
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
        type: 'image'
      });

      const uploadUrls = await uploadToFirebase(
        image.path, 
        `uploads/conversations/${conversationId}`,
        image.filename
      );
      // Xóa file ở tmp/ khi upload lên Firebase thành công
      fs.unlink(image.path, (error) => {
        if( error ) {
          throw error;
        }
      });

      newMessage.content = uploadUrls.url;
      newMessage.description = uploadUrls.urlDownload;

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
    
    // Xóa file ở tmp/ khi không tìm thấy conversation tương ứng
    fs.unlink(image.path, (error) => {
      if( error ) {
        throw error;
      }
    });

    return {
      success: false,
      message: 'Send message to Conversation failed!'
    };
  } catch (error) {
    throw createError(error.statusCode || 500, error.message || 'Internal Server Error');
  }
};

const sendFileMessage = async ({ userId, conversationId, file }) => {
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
        type: 'file'
      });

      const uploadUrls = await uploadToFirebase(
        file.path, 
        `uploads/conversations/${conversationId}`,
        file.filename
      );
      // Xóa file ở tmp/ khi upload lên Firebase thành công
      fs.unlink(file.path, (error) => {
        if( error ) {
          throw error;
        }
      });

      newMessage.content = file.originalname;
      newMessage.description = uploadUrls.urlDownload

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
    
    // Xóa file ở tmp/ khi không tìm thấy conversation tương ứng
    fs.unlink(image.path, (error) => {
      if( error ) {
        throw error;
      }
    });

    return {
      success: false,
      message: 'Send message to Conversation failed!'
    };
  } catch (error) {
    throw createError(error.statusCode || 500, error.message || 'Internal Server Error');
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

const unseenConversation = async ({ userId, conversationId }) =>  {
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
        conversation.firstPersonSeen = false;
      } else {
        conversation.secondPersonSeen = false;
      }

      await conversation.save();

      return {
        success: true,
        message: 'Mark unseen tag for conversation successfully'
      };
    }

    return {
      success: false,
      message: 'Mark unseen tag for conversation failed!'
    };
  } catch (error) {
    throw createError(error.statusCode || 500, error.message || 'Internal Server Error');
  }
};

const getRecentMessages = async ({ userId, conversationId, skip, take }) => {
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
      const messages = await FriendMessage.find({
        friendship: conversationId
      }).limit(take).skip(skip).sort({ createdAt: -1 });

      return {
        success: true,
        messages: messages.reverse()
      };
    }

    return {
      success: false,
      message: 'Get list recent messages in Conversation failed!'
    };
  } catch (error) {
    throw createError(error.statusCode || 500, error.message || 'Internal Server Error');
  }
};

const deleteMessage = async ({ userId, conversationId, messageId }) => {
  try {
    const deletedMessage = await FriendMessage.findOneAndDelete({
      _id: messageId,
      friendship: conversationId,
      from: userId
    });

    if( deletedMessage ) {
      io.to(deletedMessage.to.toString()).emit('deleted-message', deletedMessage);
      
      return {
        success: true,
        deletedMessage
      };
    }

    return {
      success: false,
      message: 'Delete message failed!'
    };
  } catch (error) {
    throw createError(error.statusCode || 500, error.message || 'Internal Server Error');
  }
};

module.exports = {
  getListConversations,
  getConversation,
  sendTextMessage,
  sendImageMessage,
  sendFileMessage,
  seenConversation,
  unseenConversation,
  getRecentMessages,
  deleteMessage
}
