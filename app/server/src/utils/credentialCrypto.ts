import crypto from "crypto";
import { config } from "../config/config.ts";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;

const getKey = () => {
  const key = config.credentialEncryptionKey;
  if (!key || key.length !== 64) {
    throw new Error(
      "CREDENTIAL_ENCRYPTION_KEY must be set to a 64-character hex string (32 bytes).",
    );
  }
  return Buffer.from(key, "hex");
};

// Node integration credentials (OpenAI keys, Gmail/SMTP passwords, Slack tokens, ...)
// must be readable again to call the provider on the user's behalf, so they are
// encrypted at rest rather than hashed.
export const encryptCredentials = (value: unknown): string => {
  const key = getKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const plaintext = JSON.stringify(value);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return Buffer.concat([iv, authTag, encrypted]).toString("base64");
};

export const decryptCredentials = <T = Record<string, unknown>>(payload: string): T => {
  const key = getKey();
  const raw = Buffer.from(payload, "base64");

  const iv = raw.subarray(0, IV_LENGTH);
  const authTag = raw.subarray(IV_LENGTH, IV_LENGTH + 16);
  const encrypted = raw.subarray(IV_LENGTH + 16);

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return JSON.parse(decrypted.toString("utf8"));
};
