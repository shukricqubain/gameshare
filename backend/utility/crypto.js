const { randomBytes, createCipheriv, createDecipheriv } = require('node:crypto');

let crypto;
///check if crypto is supported
try {
    crypto = require('node:crypto');
} catch (err) {
    console.error('crypto support is disabled!');
}

const algorithm = 'aes256';
const key = randomBytes(32);
const iv = randomBytes(16);

function encrypt(data) {
    try {
        const cipher = createCipheriv(algorithm, key, iv);
        const encryptedData = cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
        return encryptedData;
    } catch (err) {
        console.log(err);
    }
}

function decrypt(data) {
    try {
        const decipher = createDecipheriv(algorithm, key, iv);
        const decryptedData = decipher.update(data, 'hex', 'utf-8') + decipher.final('utf8');
        return decryptedData;
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    encrypt,
    decrypt
};