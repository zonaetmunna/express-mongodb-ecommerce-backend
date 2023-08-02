const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { usersCollection } = require('../..');

// User registration
exports.registerUser = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Validate input data (you can add more validation as per your requirements)
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required fields' });
      }
  
      // Check if user already exists
      const existingUser = await req.usersCollection.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: 'User already exists' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create the user
      await req.usersCollection.insertOne({ email, password: hashedPassword });
  
      res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
      console.error('Error registering user:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  // User login
  exports.loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Find the user
      const user = await req.usersCollection.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Check the password
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Create JWT token
      const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET);
  
      // Set JWT token as HttpOnly cookie
      res.cookie('jwt', token, {
        httpOnly: true,
        secure: true, // Set to 'true' if using HTTPS
        sameSite: 'strict', // Adjust according to your needs
        maxAge: 1000 * 60 * 60 * 24 * 7, // Token expiration time (e.g., 1 week)
      });
  
      res.status(200).json({ message: 'Login successful' });
    } catch (err) {
      console.error('Error logging in user:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  };


  exports.getAllUsers = async (req, res) => {
    try {
      const users = await req.usersCollection.find().toArray();
      res.status(200).json({users, message: 'Users fetched successfully'});
    } catch (err) {
      console.error('Error fetching users:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  exports.updateUser = async (req, res) => {
    try {
      const { userId, email, password } = req.body;
  
      // Validate input data (you can add more validation as per your requirements)
      if (!userId || !email || !password) {
        return res.status(400).json({ message: 'UserId, email, and password are required fields' });
      }
  
      // Check if user with the given userId exists
      const user = await req.usersCollection.findOne({ _id: userId });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Update the user details
      await req.usersCollection.updateOne({ _id: userId }, { $set: { email, password: hashedPassword } });
  
      res.status(200).json({ message: 'User details updated successfully' });
    } catch (err) {
      console.error('Error updating user:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  // Delete user
  exports.deleteUser = async (req, res) => {
    try {
      const { userId } = req.params;
  
      // Check if user with the given userId exists
      const user = await req.usersCollection.findOne({ _id: userId });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Delete the user
      await req.usersCollection.deleteOne({ _id: userId });
  
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
      console.error('Error deleting user:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  };