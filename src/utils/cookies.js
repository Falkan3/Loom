/**
 * Set cookie
 * Source: http://www.quirksmode.org/js/cookies.html
 *
 * @param name
 * @param value
 * @param hours
 */
export function setCookie(name, value, hours) {
    let expires = '';
    if (hours) {
        const date = new Date();
        date.setTime(date.getTime() + (hours * 60 * 60 * 1000));
        expires = `; expires=${date.toUTCString()}`;
    }
    document.cookie = `${name}=${value || ''}${expires}; path=/`;
}

/**
 * Get cookie
 * Source: http://www.quirksmode.org/js/cookies.html
 *
 * @param name
 */
export function getCookie(name) {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

/**
 * Erase cookie
 * Source: http://www.quirksmode.org/js/cookies.html
 *
 * @param name
 */
export function eraseCookie(name) {
    document.cookie = `${name}=; max-age=Thu, 01 Jan 1970 00:00:00 UTC; path=/`; // Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;
}

export default getCookie;
