// routes/authRoutes.js
const express = require('express');
const { registerUser, loginUser, getAllUsers, updateUser, deleteUser } = require('../controller/authController');
const { verifyToken } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/users',
// verifyToken,
getAllUsers);
router.put('/users/:userId', updateUser);

// Route to delete user
router.delete('/users/:userId', deleteUser);

module.exports = router;