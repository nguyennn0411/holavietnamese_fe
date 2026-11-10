export const OTP_LENGTH = 6;
export const VERIFICATION_EMAIL_KEY = 'hola:pending-verification-email';
export const RESEND_AVAILABLE_AT_KEY = 'hola:verification-resend-at';
export const POST_VERIFICATION_PATH_KEY = 'hola:post-verification-path';

export const sanitizeOtp = (value = '') => String(value).replace(/\D/g, '').slice(0, OTP_LENGTH);

export const isValidOtp = (value) => /^\d{6}$/.test(value);

export const isSuccessfulAuthResponse = (response) => response?.code === 1000;

export function getDevelopmentOtp(response, isDevelopment) {
  if (!isDevelopment) return '';
  const otp = sanitizeOtp(response?.result?.verificationOtp);
  return isValidOtp(otp) ? otp : '';
}

export function getRegistrationVerificationState(response, isDevelopment = false) {
  return {
    success: isSuccessfulAuthResponse(response),
    email: response?.result?.email?.trim() || '',
    message: response?.message || '',
    developmentOtp: getDevelopmentOtp(response, isDevelopment),
  };
}

export function getVerificationErrorMessage(error) {
  if (Number(error?.code) === 2002) {
    return error?.message || 'Mã OTP không hợp lệ hoặc đã hết hạn';
  }
  return error?.message || 'Không thể xác minh email. Vui lòng thử lại.';
}

export function getUnverifiedLoginEmail(result, submittedIdentity = '') {
  if (Number(result?.code) !== 1012) return null;
  const responseEmail = result?.data?.email || result?.email;
  if (responseEmail) return String(responseEmail).trim();
  const identity = String(submittedIdentity).trim();
  return identity.includes('@') ? identity : '';
}

export function savePendingVerificationEmail(email) {
  const normalized = String(email || '').trim();
  if (typeof sessionStorage === 'undefined') return normalized;
  if (normalized) sessionStorage.setItem(VERIFICATION_EMAIL_KEY, normalized);
  else sessionStorage.removeItem(VERIFICATION_EMAIL_KEY);
  return normalized;
}

export function loadPendingVerificationEmail() {
  if (typeof sessionStorage === 'undefined') return '';
  return sessionStorage.getItem(VERIFICATION_EMAIL_KEY) || '';
}

export function clearPendingVerification() {
  if (typeof sessionStorage === 'undefined') return;
  sessionStorage.removeItem(VERIFICATION_EMAIL_KEY);
  sessionStorage.removeItem(RESEND_AVAILABLE_AT_KEY);
}

export function savePostVerificationPath(path = '/onboarding/reason') {
  const safePath = typeof path === 'string' && path.startsWith('/') && !path.startsWith('//')
    ? path
    : '/onboarding/reason';
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.setItem(POST_VERIFICATION_PATH_KEY, safePath);
  }
  return safePath;
}

export function loadPostVerificationPath() {
  if (typeof sessionStorage === 'undefined') return '/onboarding/reason';
  return sessionStorage.getItem(POST_VERIFICATION_PATH_KEY) || '/onboarding/reason';
}

export function clearPostVerificationPath() {
  if (typeof sessionStorage === 'undefined') return;
  sessionStorage.removeItem(POST_VERIFICATION_PATH_KEY);
}

export function startResendCooldown(seconds = 60, now = Date.now()) {
  const availableAt = now + seconds * 1000;
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.setItem(RESEND_AVAILABLE_AT_KEY, String(availableAt));
  }
  return availableAt;
}

export function getRemainingCooldown(now = Date.now()) {
  if (typeof sessionStorage === 'undefined') return 0;
  const availableAt = Number(sessionStorage.getItem(RESEND_AVAILABLE_AT_KEY) || 0);
  return Math.max(0, Math.ceil((availableAt - now) / 1000));
}
