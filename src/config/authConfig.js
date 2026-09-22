/**
 * Official Google OAuth 2.0 & Identity Services Configuration
 * TechyDeveloper platform client configuration
 */
const DEFAULT_CLIENT_ID = typeof atob !== 'undefined'
  ? atob('ODA5OTY2MDA3NTQwLWN1c2pncWNsOTBnbTFsYTVkN3JoajFzOTQybjdnZ3ZhLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29t')
  : '';

export const GOOGLE_AUTH_CONFIG = {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || DEFAULT_CLIENT_ID,
  redirectUri: typeof window !== 'undefined' ? window.location.origin : 'https://techydeveloper.vercel.app'
};
