import sodium from "libsodium-wrappers";

let sodiumReady = false;
const getSodium = async () => {
  if (!sodiumReady) {
    await sodium.ready; 
    sodiumReady = true;
  }
  return sodium;
};

const base64Key = import.meta.env.VITE_ENCRYPTION_KEY!;
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

export async function decryptMessage(
  cipherText: string | undefined | null
): Promise<string> {
  if (typeof cipherText !== "string" || !cipherText.startsWith("ENC:")) {
    return cipherText as string || "";
  }
  const actualCipher = cipherText.slice("ENC:".length);

  const s = await getSodium();
  const key = s.from_base64(
    base64Key,
    s.base64_variants.URLSAFE_NO_PADDING
  );

  let payload: Uint8Array;
  try {
    payload = s.from_base64(
      actualCipher,
      s.base64_variants.URLSAFE_NO_PADDING
    );
  } catch (e) {
    console.error("Decrypt: Base64 decoding failed", e);
    // Return original cipherText so prefix remains (or empty)
    return cipherText;
  }

  const nonceBytes = s.crypto_secretbox_NONCEBYTES;
  const macBytes = s.crypto_secretbox_MACBYTES;

  if (payload.length < nonceBytes + macBytes) {
    console.warn("Decrypt: Payload too short");
    return cipherText; // return full original with prefix
  }

  const nonce = payload.slice(0, nonceBytes);
  const cipher = payload.slice(nonceBytes);

  try {
    const decrypted = s.crypto_secretbox_open_easy(cipher, nonce, key);
    return s.to_string(decrypted);
  } catch (e) {
    console.error("Decrypt: crypto_secretbox_open_easy failed", e);
    // Return original cipherText so prefix remains (or empty string)
    return cipherText;
  }
}