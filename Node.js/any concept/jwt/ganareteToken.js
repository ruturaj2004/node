const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;
const secretKey = 'your-secret-key';
app.use(express.json());
app.post('/generate-token', (req, res) => {
  const { username, role } = req.body;

  if (!username || !role) {
    return res.status(400).json({ message: 'Username and role are required' });
  }

  const token = jwt.sign({ username, role }, secretKey, { expiresIn: '1h' });
  res.json({ token });
});

function verifyToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Token is missing' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = decoded;
    next();
  });
}

// Example protected route
app.get('/protected', verifyToken, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
