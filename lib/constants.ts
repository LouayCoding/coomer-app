export const SESSION_COOKIE = process.env.SESSION_COOKIE || 'session=eyJfcGVybWFuZW50Ijp0cnVlLCJhY2NvdW50X2lkIjoxOTE0MDgzfQ.Z4RYSg.tgZLgOBRXlGU7oPHKKZvXPTgZJo';

export const COOMER_API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://coomer.st/api/v1';

// Debug logging
console.log('🔧 API Configuration:', {
  hasSessionCookie: !!SESSION_COOKIE,
  sessionCookieSource: process.env.SESSION_COOKIE ? 'env variable' : 'fallback',
  sessionCookiePreview: SESSION_COOKIE.substring(0, 50) + '...',
  apiBase: COOMER_API_BASE
});

export const API_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/135.0.6790.160 Mobile/15E148 Safari/604.1',
  'Accept': 'text/css',
  'Accept-Encoding': 'gzip, deflate, br',
  'Cookie': SESSION_COOKIE,
  'Referer': 'https://coomer.st/artists'
};

export const SERVICES = [
  'onlyfans',
  'fansly',
  'patreon',
  'fanbox',
  'subscribestar'
] as const;
