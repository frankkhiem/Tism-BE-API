const { Joi } = require('express-validation')

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
}

module.exports = {
  getConversation,
  sendTextMessage,
  seenConversation
}
