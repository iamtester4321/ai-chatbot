import { createECDH, createHash } from "crypto";

// Server ECDH keypair using P-256 (prime256v1)
const serverECDH = createECDH("prime256v1");
serverECDH.generateKeys();

// Export raw server public key (uncompressed EC point), base64 encoded
export const SERVER_PUBKEY_BASE64 = serverECDH.getPublicKey("base64");

// Derive AES key from client's raw public key (base64-encoded)
export function deriveAesKeyFromClientPub(clientPubB64: string): Buffer {
  const clientPubKeyRaw = Buffer.from(clientPubB64, "base64");

  // computeSecret expects raw uncompressed EC point
  const sharedSecret = serverECDH.computeSecret(clientPubKeyRaw);

  // Derive AES key using SHA-256 hash of shared secret
  return createHash("sha256").update(sharedSecret).digest();
}
