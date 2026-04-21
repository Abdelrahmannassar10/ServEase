import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scrypt,
} from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt);

const PASSWORD = process.env.ENCRYPTION_SECRET || 'super-secret-key';
const SALT = 'secure-salt-value'; 

let key: Buffer;

async function getKey(): Promise<Buffer> {
  if (!key) {
    key = (await scryptAsync(PASSWORD, SALT, 32)) as Buffer;
  }
  return key;
}

export async function encrypt(plainText: string): Promise<string> {
  if (!plainText) {
    throw new Error('Encrypt called with empty value');
  }

  const key = await getKey();
  const iv = randomBytes(12); 

  const cipher = createCipheriv('aes-256-gcm', key, iv);

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

export async function decrypt(encryptedData: string): Promise<string> {
  if (!encryptedData) {
    throw new Error('Decrypt called with empty value');
  }

  const key = await getKey();

  const [ivHex, authTagHex, encryptedHex] = encryptedData.split(':');

  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const encryptedText = Buffer.from(encryptedHex, 'hex');

  const decipher = createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(encryptedText),
    decipher.final(),
  ]);

  return decrypted.toString('utf8');
}


export function isEncrypted(value: string): boolean {
  return typeof value === 'string' &&
         value.includes(':') &&
         value.split(':').length === 3;
}