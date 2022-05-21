const express = require('express');

const authRouter = require('./authRoutes');
const userRouter = require('./userRoutes');
const teamRouter = require('./teamRoutes');
const friendRouter = require('./friendRoutes');
const conversationRouter = require('./conversationRoutes');

const router = express.Router();

// Render Home page
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Tism services API'
  });
});

// Routes for authentication
router.use('/', authRouter);

// Routes for user
router.use('/user', userRouter);

// Routes for team
router.use('/team', teamRouter);
// Routes for friend
router.use('/friends', friendRouter);

// Routes for friend conversations
router.use('/conversations', conversationRouter);

router.post('/socket/test', (req, res) => {
  const { userId } = req.body;
  io.to(userId).emit('test-socket', {
    success: true,
    message: 'abc'
  });
  // console.log(io);
  res.status(200).json({
    success: true
  });
});

// Response not found with url not match
router.use('/*', (req, res, next) => {
  res.status(400).json({
    message: 'No service provided for this Endpoint'
  });
});

module.exports = router;
