import test, { afterEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {
  getDevelopmentOtp,
  getRegistrationVerificationState,
  getRemainingCooldown,
  getUnverifiedLoginEmail,
  getVerificationErrorMessage,
  isSuccessfulAuthResponse,
  isValidOtp,
  sanitizeOtp,
  startResendCooldown,
} from '../src/features/auth/emailVerificationFlow.js';

const originalSessionStorage = globalThis.sessionStorage;

function installSessionStorage() {
  const values = new Map();
  globalThis.sessionStorage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
  };
}

afterEach(() => {
  if (originalSessionStorage === undefined) delete globalThis.sessionStorage;
  else globalThis.sessionStorage = originalSessionStorage;
});

test('đăng ký thành công chuyển sang trạng thái chờ xác minh và không dùng JWT', () => {
  const response = {
    code: 1000,
    message: 'Đăng ký thành công. Vui lòng kiểm tra email để lấy mã OTP',
    result: { id: 1, username: 'username', email: 'user@gmail.com', emailVerified: false, token: 'must-be-ignored', verificationOtp: '123456' },
  };
  const state = getRegistrationVerificationState(response, true);
  assert.deepEqual(state, {
    success: true,
    email: 'user@gmail.com',
    message: response.message,
    developmentOtp: '123456',
  });
  assert.equal('token' in state, false);
  assert.equal(getDevelopmentOtp(response, false), '');
});

test('OTP sai hiển thị đúng lỗi code 2002', () => {
  const error = { status: 400, code: 2002, message: 'Mã OTP không hợp lệ hoặc đã hết hạn' };
  assert.equal(getVerificationErrorMessage(error), error.message);
  assert.equal(isValidOtp('12345'), false);
  assert.equal(sanitizeOtp('12a34-56'), '123456');
});

test('OTP đúng nhận response thành công', () => {
  assert.equal(isValidOtp('123456'), true);
  assert.equal(isSuccessfulAuthResponse({ code: 1000, message: 'Xác minh email thành công' }), true);
});

test('OTP hết hạn dùng cùng thông báo an toàn code 2002', () => {
  assert.equal(
    getVerificationErrorMessage({ status: 400, code: 2002 }),
    'Mã OTP không hợp lệ hoặc đã hết hạn',
  );
});

test('gửi lại OTP tạo bộ đếm 60 giây và chỉ lộ OTP trong development', () => {
  installSessionStorage();
  const now = 1_000_000;
  startResendCooldown(60, now);
  assert.equal(getRemainingCooldown(now), 60);
  assert.equal(getRemainingCooldown(now + 59_001), 1);
  assert.equal(getRemainingCooldown(now + 60_000), 0);
  const response = { code: 1000, result: { verificationOtp: '654321' } };
  assert.equal(getDevelopmentOtp(response, true), '654321');
  assert.equal(getDevelopmentOtp(response, false), '');
});

test('đăng nhập tài khoản chưa xác minh chuyển email sang luồng OTP', () => {
  assert.equal(getUnverifiedLoginEmail({ code: 1012 }, 'user@gmail.com'), 'user@gmail.com');
  assert.equal(getUnverifiedLoginEmail({ code: 1012, data: { email: 'verified-target@gmail.com' } }, 'username'), 'verified-target@gmail.com');
  assert.equal(getUnverifiedLoginEmail({ code: 1001 }, 'user@gmail.com'), null);
});

test('auth API khai báo đúng ba endpoint OTP', async () => {
  const source = await fs.readFile(new URL('../src/shared/api/authApi.js', import.meta.url), 'utf8');
  assert.match(source, /post\('\/api\/auth\/register'/);
  assert.match(source, /post\('\/api\/auth\/verify-email\/otp'/);
  assert.match(source, /post\('\/api\/auth\/verify-email\/resend'/);
});
