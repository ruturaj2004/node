const QRCode = require('qrcode');

QRCode.toString('Encode this text in QR code', {
  errorCorrectionLevel: 'H',
  type: 'svg'
}, function(err, data) {
  if (err) throw err;
  console.log(data);
});