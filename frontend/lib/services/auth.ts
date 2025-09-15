/**
 * Retrieves the authentication token from localStorage.
 * hulk-react-utils stores the token under the key 'hulk_auth'.
 * 
 * @returns {string | null} The authentication token, or null if not found.
 */
export function getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    const hulkData = localStorage.getItem('hulk_auth');
    if (!hulkData) return null;

    const tokenData = JSON.parse(hulkData);

    // After a token refresh, the data is an object: { access_token: '...' }
    if (typeof tokenData === 'object' && tokenData !== null) {
        return tokenData.access_token || null;
    }

    // On initial login, the data is just the token string.
    if (typeof tokenData === 'string') {
        return tokenData;
    }

    return null;
}