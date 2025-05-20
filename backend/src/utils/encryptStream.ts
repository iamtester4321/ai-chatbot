import { Transform } from "stream";
import { randomBytes, createCipheriv, createDecipheriv } from "crypto";

export function createAesGcmEncryptStream(key: Buffer) {
  return new Transform({
    transform(chunk, _enc, cb) {
      const iv = randomBytes(12);
      const cipher = createCipheriv("aes-256-gcm", key, iv);
      const ciphertext = Buffer.concat([cipher.update(chunk), cipher.final()]);
      const tag = cipher.getAuthTag();

      // now: [ iv | ciphertext | tag ]
      const payload = Buffer.concat([iv, ciphertext, tag]).toString("base64");
      cb(null, `data: ${payload}\n\n`);
    },
  });
}

export function decryptAesPayload(b64: string, aesKeyBuffer: Buffer): string {
  const raw = Buffer.from(b64, "base64");
  const iv = raw.slice(0, 12);
  const ciphertext = raw.slice(12, raw.length - 16);
  const tag = raw.slice(raw.length - 16);
  const decipher = createDecipheriv("aes-256-gcm", aesKeyBuffer, iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
}

export function encryptWithAesGcm(plaintext: string, key: Buffer): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);

  const ciphertext = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();

  const payload = Buffer.concat([iv, ciphertext, tag]);
  return payload.toString("base64"); // store this in DB
}
