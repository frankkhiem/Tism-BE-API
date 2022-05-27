const { Joi } = require('express-validation');

const getConversation = {
  params: Joi.object({
    conversationId: Joi.string().required()
  }),
};

const sendTextMessage = {
  params: Joi.object({
    conversationId: Joi.string().required()
  }),
  body: Joi.object({
    content: Joi.string().required()
  })
};

const seenConversation = {
  params: Joi.object({
    conversationId: Joi.string().required()
  })
};

const getRecentMessages = {
  params: Joi.object({
    conversationId: Joi.string().required()
  }),
  query: Joi.object({
    skip: Joi.number().required(),
    take: Joi.number().required()
  })
};

const deleteMessage = {
  params: Joi.object({
    conversationId: Joi.string().required(),
    messageId: Joi.string().required()
  })
};

module.exports = {
  getConversation,
  sendTextMessage,
  seenConversation,
  getRecentMessages,
  deleteMessage
};
