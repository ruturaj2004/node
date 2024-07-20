const express = require('express');
const { ObjectId } = require('mongodb');

const app = express();
const port = 3000;

// Your MongoDB connection setup here

app.get('/generate-objectid', (req, res) => {
  try {
    // Generate a new ObjectId
    const newObjectId = new ObjectId();

    // Convert ObjectId to string if needed
    const objectIdString = newObjectId.toString();

    res.json({ objectId: objectIdString });
  } catch (error) {
    console.error('Error generating ObjectId:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
