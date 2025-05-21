import sodium from "libsodium-wrappers";

let sodiumReady = false;
const getSodium = async () => {
  if (!sodiumReady) {
    await sodium.ready; 
    sodiumReady = true;
  }
  return sodium;
};

const base64Key = process.env.VITE_ENCRYPTION_KEY!;
if (!base64Key) throw new Error("Encryption key not set in .env");

export async function encryptMessage(message: string): Promise<string> {
  if (!message || message.startsWith("ENC:")) return message;

  const s = await getSodium();
  const key = s.from_base64(base64Key, s.base64_variants.URLSAFE_NO_PADDING);

  const nonce = s.randombytes_buf(s.crypto_secretbox_NONCEBYTES);
  const cipher = s.crypto_secretbox_easy(s.from_string(message), nonce, key);
  console.log("Original message length:", message.length);
  console.log("Nonce length:", nonce.length);
  console.log("Cipher length:", cipher.length);
  console.log("Plaintext length:", message.length);

  const payload = new Uint8Array(nonce.length + cipher.length);
  payload.set(nonce);
  payload.set(cipher, nonce.length);

  return `ENC:${s.to_base64(payload, s.base64_variants.URLSAFE_NO_PADDING)}`;
}

export async function decryptMessage(encrypted: string): Promise<string> {
  if (!encrypted || !encrypted.startsWith("ENC:")) return encrypted;
  const s = await getSodium();
  const key = s.from_base64(base64Key, s.base64_variants.URLSAFE_NO_PADDING);

  const payload = s.from_base64(encrypted.slice(4), s.base64_variants.URLSAFE_NO_PADDING);
  const nonce = payload.slice(0, s.crypto_secretbox_NONCEBYTES);
  const cipher = payload.slice(s.crypto_secretbox_NONCEBYTES);

  const decrypted = s.crypto_secretbox_open_easy(cipher, nonce, key);
  return s.to_string(decrypted);
}
