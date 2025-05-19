import sodium from "libsodium-wrappers";

let sodiumReady = false;
const getSodium = async () => {
  if (!sodiumReady) {
    await sodium.ready;
    sodiumReady = true;
  }
  return sodium;
};

const key = process.env.VITE_ENCRYPTION_KEY! as string;

export async function encryptMessage(message: string): Promise<string> {
  // Skip encryption if empty or already encrypted
  if (!message || message.startsWith("ENC:")) return message;
  
  const s = await getSodium();
  const nonce = s.randombytes_buf(s.crypto_secretbox_NONCEBYTES);
  const cipher = s.crypto_secretbox_easy(
    s.from_string(message),
    nonce,
    s.from_base64(key)
  );

  const payload = new Uint8Array(nonce.length + cipher.length);
  payload.set(nonce);
  payload.set(cipher, nonce.length);

  return `ENC:${s.to_base64(payload)}`; // Add ENC: prefix
}

export async function decryptMessage(
  cipherText: string | undefined | null
): Promise<string> {
  try {
    if (!cipherText) return "";
    
    // Return as-is if not encrypted
    if (!cipherText.startsWith("ENC:")) {
      return cipherText;
    }

    const s = await getSodium();
    const actualCipher = cipherText.slice(4); // Remove the "ENC:" prefix

    const payload = s.from_base64(actualCipher);
    const nonce = payload.slice(0, s.crypto_secretbox_NONCEBYTES);
    const cipher = payload.slice(s.crypto_secretbox_NONCEBYTES);

    const plain = s.crypto_secretbox_open_easy(
      cipher,
      nonce,
      s.from_base64(key)
    );

    return s.to_string(plain);
  } catch (error) {
    console.error("Decryption failed for message:", cipherText, error);
    return cipherText || ""; 
  }
}