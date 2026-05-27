import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scrypt,
} from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt);

const SALT = 'secure-salt-value'; 
const LEGACY_DEFAULT_PASSWORD = 'super-secret-key';

let key: Buffer;
let keyPassword: string;

function getPassword(): string {
  return (
    process.env.ENCRYPTION_SECRET ||
    process.env.ENCRYPTION_SECRET_KEY ||
    LEGACY_DEFAULT_PASSWORD
  );
}

async function deriveKey(password: string): Promise<Buffer> {
  return (await scryptAsync(password, SALT, 32)) as Buffer;
}

async function getKey(): Promise<Buffer> {
  const password = getPassword();

  if (!key || keyPassword !== password) {
    key = await deriveKey(password);
    keyPassword = password;
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

  return decryptWithKey(encryptedData, await getKey());
}

async function decryptWithPassword(
  encryptedData: string,
  password: string,
): Promise<string> {
  return decryptWithKey(encryptedData, await deriveKey(password));
}

function decryptWithKey(encryptedData: string, key: Buffer): string {
  const parts = encryptedData.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted payload format');
  }

  const [ivHex, authTagHex, encryptedHex] = parts;

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

export async function safeDecrypt(value: unknown): Promise<string | null> {
  if (typeof value !== 'string' || !isEncrypted(value)) {
    return value as string | null;
  }

  try {
    return await decrypt(value);
  } catch {
    if (getPassword() === LEGACY_DEFAULT_PASSWORD) {
      return null;
    }

    try {
      return await decryptWithPassword(value, LEGACY_DEFAULT_PASSWORD);
    } catch {
      return null;
    }
  }
}

export function isEncrypted(value: string): boolean {
  return typeof value === 'string' &&
         value.includes(':') &&
         value.split(':').length === 3;
}
