const express = require('express');

const authRouter = require('./authRoutes');
const userRouter = require('./userRoutes');
const teamRouter = require('./teamRoutes');

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

// Response not found with url not match
router.use('/*', (req, res, next) => {
  res.status(400).json({
    message: 'No service provided for this Endpoint'
  });
});

module.exports = router;
