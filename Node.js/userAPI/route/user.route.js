const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const User = require('../models/user.model');

router.use(bodyParser.json());

// MongoDB connection (replace with your MongoDB URL)
mongoose.connect('mongodb://localhost/user-api', {
  useNewUrlParser: true,
  useUnifiedTopology: true, 
});

// Create a new user
router.post('/users', async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific user by ID
router.get('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.json(user);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a user by ID
router.put('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
    if (!updatedUser) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.json(updatedUser);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a user by ID
router.delete('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.status(204).send();
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search users
router.get('/search', async (req, res) => {
  try {
    const searchTerm = req.query.q;
    const regex = new RegExp(searchTerm, 'i'); // Case-insensitive search
    const users = await User.find({
      $or: [{ username: regex }, { email: regex }],
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
