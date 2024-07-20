// const express = require("express");
// const app = express();

// const auth = require("./qrcode.route");

// app.use("/auth", auth);

// const port = process.env.PORT || 3001;
// app.listen(port, () => {
// console.log(`Listening to port ${port}...`);
// });
const express = require('express');
const qr = require('qrcode');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/generate-qr', (req, res) => {
  const { data, size = 200 } = req.query;

  if (!data) {
    return res.status(400).json({ error: 'Data parameter is required' });
  }

  qr.toDataURL(data, { errorCorrectionLevel: 'H', width: size, height: size }, (err, url) => {
    if (err) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    res.json({ qrCodeUrl: url });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
