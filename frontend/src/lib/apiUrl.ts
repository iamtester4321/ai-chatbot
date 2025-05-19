export const BASE_API = import.meta.env.VITE_BACKEND_API_URL;

// auth API
export const REGISTER_API = `${BASE_API}/api/auth/register`;
export const LOGIN_API = `${BASE_API}/api/auth/login`;
export const GOOGLE_AUTH_API = `${BASE_API}/api/auth/google`;
export const LOGOUT_API = `${BASE_API}/api/auth/logout`;

// user API
export const GET_USER_PROFILE = `${BASE_API}/api/user/myprofile`;

// chat API
export const STREAM_CHAT_RESPONSE = (mode: string) =>
  `${BASE_API}/api/chat/stream${mode}`;
export const GET_CHAT_MESSAGES = `${BASE_API}/api/chat`;
export const GET_SHARE_CHAT_MESSAGES = (shareId: string) =>
  `${BASE_API}/api/share/${shareId}`;
export const DELETE_CHAT = (chatId: string) => `${BASE_API}/api/chat/${chatId}`;
export const TOGGLE_FAVORITE_CHAT = (chatId: string) =>
  `${BASE_API}/api/chat/addOrRemoveFavrate/${chatId}`;
export const GET_CHAT_NAMES = `${BASE_API}/api/chat/names`;
export const RENAME_CHAT = (chatId: string) =>
  `${BASE_API}/api/chat/rename/${chatId}`;
export const ARCHIVE_CHAT = (chatId: string) =>
  `${BASE_API}/api/chat/addOrRemoveArchive/${chatId}`;
export const SHARE_CHAT = `${BASE_API}/api/share/generate-share-id`;

// message API
export const LIKE_MESSAGE = (messageId: string) =>
  `${BASE_API}/api/message/${messageId}/reaction/like`;
export const DISLIKE_MESSAGE = (messageId: string) =>
  `${BASE_API}/api/message/${messageId}/reaction/dislike`;
