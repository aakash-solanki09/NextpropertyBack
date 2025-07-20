const express = require('express');
const { body } = require('express-validator');
const {
  createUser,
  login,
  logout,
  getUserProfile, 
} = require('../../controller/user/userController');

const auth = require('../../middleware/auth/auth');
const router = express.Router();

router.post(
  '/register',
  [
    body('name')
      .trim()
      .notEmpty().withMessage('Name is required')
      .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email')
      .isEmail().withMessage('Invalid email'),
    body('password')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  createUser
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  login
);

router.post("/logout", auth, logout);

router.get("/profile", auth, getUserProfile);

module.exports = router;
