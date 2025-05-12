export const BASE_API = import.meta.env.VITE_BACKEND_API_URL;

// auth API
export const REGISTER_API = `${BASE_API}/api/auth/register`;
export const LOGIN_API = `${BASE_API}/api/auth/login`;
export const GOOGLE_AUTH_API = `${BASE_API}/api/auth/google`;

// chat API
export const STREAM_CHAT_RESPONSE = `${BASE_API}/api/chat/stream`;
export const GET_CHAT_MESSAGES = `${BASE_API}/api/chat`;
export const DELETE_CHAT = (chatId: string) => `${BASE_API}/api/chat/${chatId}`;
export const TOGGLE_FAVORITE_CHAT = (chatId: string) => `${BASE_API}/api/chat/addOrRemoveFavrate/${chatId}`;
