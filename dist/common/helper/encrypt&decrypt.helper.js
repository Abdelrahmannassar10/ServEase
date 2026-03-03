"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encrypt = encrypt;
exports.decrypt = decrypt;
const node_crypto_1 = require("node:crypto");
const node_util_1 = require("node:util");
const scryptAsync = (0, node_util_1.promisify)(node_crypto_1.scrypt);
const PASSWORD = process.env.ENCRYPTION_SECRET || 'super-secret-key';
const SALT = 'secure-salt-value';
let key;
async function getKey() {
    if (!key) {
        key = (await scryptAsync(PASSWORD, SALT, 32));
    }
    return key;
}
async function encrypt(plainText) {
    if (!plainText) {
        throw new Error('Encrypt called with empty value');
    }
    const key = await getKey();
    const iv = (0, node_crypto_1.randomBytes)(12);
    const cipher = (0, node_crypto_1.createCipheriv)('aes-256-gcm', key, iv);
    const encrypted = Buffer.concat([
        cipher.update(plainText, 'utf8'),
        cipher.final(),
    ]);
    const authTag = cipher.getAuthTag();
    return [
        iv.toString('hex'),
        authTag.toString('hex'),
        encrypted.toString('hex'),
    ].join(':');
}
async function decrypt(encryptedData) {
    if (!encryptedData) {
        throw new Error('Decrypt called with empty value');
    }
    const key = await getKey();
    const [ivHex, authTagHex, encryptedHex] = encryptedData.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const encryptedText = Buffer.from(encryptedHex, 'hex');
    const decipher = (0, node_crypto_1.createDecipheriv)('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);
    const decrypted = Buffer.concat([
        decipher.update(encryptedText),
        decipher.final(),
    ]);
    return decrypted.toString('utf8');
}
//# sourceMappingURL=encrypt&decrypt.helper.js.map