const express = require('express');
const app = express();
const port = process.env.PORT || 4500;
const userRoutes = require('./route/user.route');

// API routes
app.use('/api', userRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
