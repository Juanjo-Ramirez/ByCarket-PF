import Cookies from "js-cookie";

const TOKEN_KEY = "authToken";
const REMEMBER_ME_EMAIL_KEY = "rememberedEmail";

export const setAuthToken = (token: string) => {
  Cookies.set(TOKEN_KEY, token, { expires: 7 });
};

export const getAuthToken = () => {
  return Cookies.get(TOKEN_KEY);
};

export const removeAuthToken = () => {
  Cookies.remove(TOKEN_KEY);
};

export const setRememberedEmail = (email: string) => {
  Cookies.set(REMEMBER_ME_EMAIL_KEY, email, { expires: 30 });
};

export const getRememberedEmail = () => {
  return Cookies.get(REMEMBER_ME_EMAIL_KEY);
};

export const removeRememberedEmail = () => {
  Cookies.remove(REMEMBER_ME_EMAIL_KEY);
};

const SESSION_ID_KEY = "stripe_session_id";

export const setSessionId = (sessionId: string) => {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(SESSION_ID_KEY, sessionId);
  }
};

export const getSessionId = (): string | null => {
  if (typeof window !== "undefined") {
    return sessionStorage.getItem(SESSION_ID_KEY);
  }
  return null;
};

export const clearSessionId = () => {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(SESSION_ID_KEY);
  }
};
