// const crypto = require('crypto');

// const data = 'Hello, World!';
// const hash = crypto.createHash('sha256').update(data).digest('hex');
// console.log(hash);
// console.log(data);

const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const password = 'MySecretPassword';
const data = 'Hello, World!';

const cipher = crypto.createCipher(algorithm, password);
let encrypted = cipher.update(data, 'utf8', 'hex');
encrypted += cipher.final('hex');

const decipher = crypto.createDecipher(algorithm, password);
let decrypted = decipher.update(encrypted, 'hex', 'utf8');
decrypted += decipher.final('utf8');

console.log('Encrypted:', encrypted);
console.log('Decrypted:', decrypted);
