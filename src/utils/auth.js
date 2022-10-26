//token本地缓存
const TokenKEY = "admin-token";
const timeKey = 'admin-timestamp-key'

export function setToken(token) {
  return localStorage.setItem(TokenKEY, token);
}

export function getToken() {
  return localStorage.getItem(TokenKEY);
}

export function removeToken() {
  return localStorage.removeItem(TokenKEY);
}

export function getTimeStamp() {
  return localStorage.getItem(timeKey);
}

export function setTimeStamp() {
  return localStorage.setItem(timeKey,Date.now());
}