import type {
  RegisterRequest,
  RegisterResponse,
  ResendVerificationOtpResponse,
  VerifyEmailOtpRequest,
  VerifyEmailOtpResponse,
} from '../src/shared/api/authApi.types';

export const registerRequest = {
  username: 'username',
  password: 'Password123',
  email: 'user@gmail.com',
  fullName: 'Nguyen Van A',
  phoneNumber: '',
  nativeLanguage: 'en',
  learningGoal: 'daily_communication',
  targetLevel: 'A1',
} satisfies RegisterRequest;

export const registerResponse = {
  code: 1000,
  message: 'Đăng ký thành công. Vui lòng kiểm tra email để lấy mã OTP',
  result: {
    id: 1,
    username: 'username',
    email: 'user@gmail.com',
    emailVerified: false,
    verificationOtp: '123456',
  },
} satisfies RegisterResponse;

export const verifyRequest = {
  email: 'user@gmail.com',
  otp: '123456',
} satisfies VerifyEmailOtpRequest;

export const verifyResponse = {
  code: 1000,
  message: 'Xác minh email thành công',
} satisfies VerifyEmailOtpResponse;

export const resendResponse = {
  code: 1000,
  message: 'Nếu email chưa được xác minh, mã OTP mới đã được gửi',
  result: { verificationOtp: '654321' },
} satisfies ResendVerificationOtpResponse;
