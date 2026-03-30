import { useMutation } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';
import type { AxiosResponse, AxiosError } from 'axios';
import companyApiInstance from './companyApiInstance';

export interface OTPRequestData {
  email: string;
  purpose: string;
}

export interface OTPVerificationData {
  otp: string;
}

// OTP response interface
export interface OTPResponse {
  success: boolean;
  message: string;
  data?: any;
}

// OTP verification response interface
export interface OTPVerificationResponse {
  success: boolean;
  message: string;
  company: {
    id: number;
    companyName: string;
    companyEmail: string;
    companyContact: string;
  };
  accessToken: string;
}

export function useSendOTP(
  options?: UseMutationOptions<
    AxiosResponse<OTPResponse>,
    AxiosError,
    OTPRequestData
  >
) {
  return useMutation({
    mutationFn: async (data: OTPRequestData) => {
      return await companyApiInstance.post<OTPResponse>('/auth-message/send-otp-existing-user', data);
    },
    onError: (error: AxiosError) => {
      console.error('OTP send error:', error);
    },
    ...options,
  });
}

// Hook for verifying OTP
export function useVerifyOTP(
  options?: UseMutationOptions<
    AxiosResponse<OTPVerificationResponse>,
    AxiosError,
    OTPVerificationData
  >
) {
  return useMutation({
    mutationFn: async (data: OTPVerificationData) => {
      return await companyApiInstance.post<OTPVerificationResponse>('/auth-message/verify-otp', data);
    },
    onError: (error: AxiosError) => {
      console.error('OTP verification error:', error);
    },
    ...options,
  });
}
