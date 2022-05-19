const conversationService = require('../../services/conversationService');

// [GET] /conversations
const getListConversations = async (req, res) => {
  try {
    const userId = req.userId;

    const result = await conversationService.getListConversations({ userId });

    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 400);
    res.json(error);
  }
};

// [GET] /conversations/:conversationId
const getConversation = async (req, res) => {
  try {
    const userId = req.userId;
    const { conversationId } = req.params;

    const result = await conversationService.getConversation({ userId, conversationId });

    if( result.success ) {
      return res.status(200).json(result);
    }
    return res.status(400).json(result);
  } catch (error) {
    res.status(error.status || 400);
    res.json(error);
  }
};

// [POST] /conversations/:conversationId/text-message
const sendTextMessage = async (req, res) => {
  try {
    const userId = req.userId;
    const { conversationId } = req.params;
    const { content } = req.body;

    const result = await conversationService.sendTextMessage({ userId, conversationId, content });

    if( result.success ) {
      return res.status(200).json(result);
    }
    return res.status(400).json(result);
  } catch (error) {
    res.status(error.status || 400);
    res.json(error);
  }
};

// [PATCH] /conversations/:conversationId/seen
const seenConversation = async (req, res) => {
  try {
    const userId = req.userId;
    const { conversationId } = req.params;

    const result = await conversationService.seenConversation({ userId, conversationId });

    if( result.success ) {
      return res.status(200).json(result);
    }
    return res.status(400).json(result);
  } catch (error) {
    res.status(error.status || 400);
    res.json(error);
  }
}

module.exports = {
  getListConversations,
  getConversation,
  sendTextMessage,
  seenConversation
}
