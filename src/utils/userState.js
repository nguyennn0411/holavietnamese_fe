export const HAS_ACCOUNT_KEY = 'hola:has_account';

/**
 * Checks whether the current visitor has an existing account on this device.
 * Returns true if the user has previously logged in, registered, or holds credentials.
 */
export function hasExistingAccount() {
  try {
    if (localStorage.getItem(HAS_ACCOUNT_KEY) === 'true') return true;
    if (localStorage.getItem('token')) return true;
    if (localStorage.getItem('user')) return true;
    if (localStorage.getItem('userId')) return true;
    if (localStorage.getItem('username')) return true;
    return false;
  } catch {
    return false;
  }
}

/**
 * Marks that this client/device has an existing registered account.
 * Called upon successful login or registration.
 */
export function markHasAccount() {
  try {
    localStorage.setItem(HAS_ACCOUNT_KEY, 'true');
  } catch {
    // Ignore storage availability errors
  }
}

/**
 * Returns the recommended auth entry route:
 * - Existing user -> '/login'
 * - New user without an account -> '/welcome'
 */
export function getSmartAuthRoute() {
  return hasExistingAccount() ? '/login' : '/welcome';
}
