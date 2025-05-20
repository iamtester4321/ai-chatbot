import axios from "axios";

// Create and store keys in memory
let clientKeyPair: CryptoKeyPair | null = null;

export async function performHandshake(): Promise<{
  aesKey: CryptoKey;
  serverPubkey: string;
}> {
  // 1) Generate ECDH key pair (P-256), allow deriveBits
  clientKeyPair = await window.crypto.subtle.generateKey(
    { name: "ECDH", namedCurve: "P-256" },
    true,
    ["deriveBits"]
  );

  // 2) Export client public
  const clientPubRaw = await window.crypto.subtle.exportKey(
    "raw",
    clientKeyPair.publicKey
  );
  const clientPubB64 = btoa(
    String.fromCharCode(...new Uint8Array(clientPubRaw))
  );

  const BASE_API = import.meta.env.VITE_BACKEND_API_URL;

  // 3) Send to server, get back its public
  const { data } = await axios.post(
    `${BASE_API}/api/handshake`,
    { clientPubkey: clientPubB64 },
    { withCredentials: true }
  );
  const serverPubkey = data.serverPubkey;

  // 4) Import server public
  const serverRaw = Uint8Array.from(atob(serverPubkey), (c) => c.charCodeAt(0));
  const serverKey = await window.crypto.subtle.importKey(
    "raw",
    serverRaw,
    { name: "ECDH", namedCurve: "P-256" },
    false,
    []
  );

  // 5) Derive the raw 32-byte shared secret
  const sharedSecretBits = await window.crypto.subtle.deriveBits(
    { name: "ECDH", public: serverKey },
    clientKeyPair.privateKey!,
    256
  );
  // 6) Hash it with SHA-256 → 32-byte key
  const hashedKey = await window.crypto.subtle.digest(
    "SHA-256",
    sharedSecretBits
  );

  // 7) Import as AES-GCM key (extractable)
  const aesKey = await window.crypto.subtle.importKey(
    "raw",
    hashedKey,
    { name: "AES-GCM" },
    true,
    ["encrypt", "decrypt"]
  );

  return { aesKey, serverPubkey };
}

export async function decryptChunk(
  aesKey: CryptoKey,
  b64: string
): Promise<string> {
  const raw = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));

  const iv = raw.slice(0, 12);
  const ctPlusTag = raw.slice(12); // ciphertext || tag

  const decrypted = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv, tagLength: 128 },
    aesKey,
    ctPlusTag
  );

  return new TextDecoder().decode(decrypted);
}

export async function encryptWithAesKey(
  aesKey: CryptoKey,
  text: string
): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(text);
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    aesKey,
    encoded
  );
  const payload = new Uint8Array([...iv, ...new Uint8Array(ciphertext)]);
  return btoa(String.fromCharCode(...payload));
}

export async function decryptWithAesKey(
  aesKey: CryptoKey,
  encryptedB64: string
): Promise<string> {
  const encrypted = Uint8Array.from(atob(encryptedB64), (c) => c.charCodeAt(0));
  const iv = encrypted.slice(0, 12);
  const tag = encrypted.slice(encrypted.length - 16);
  const ciphertext = encrypted.slice(12, encrypted.length - 16);

  const data = new Uint8Array(ciphertext.length + tag.length);
  data.set(ciphertext);
  data.set(tag, ciphertext.length);

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    aesKey,
    data
  );

  return new TextDecoder().decode(decrypted);
}
