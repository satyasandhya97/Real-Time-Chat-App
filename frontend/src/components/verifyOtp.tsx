'use client';
import axios from 'axios';
import { ArrowRight, ChevronLeft, Loader2, Lock } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import Cookies from 'js-cookie';
import { useAppData, user_service } from '@/context/AppContext';
import Loading from './loading';
import toast from 'react-hot-toast';

const VerifyOtp: React.FC = () => {
  const { isAuth, setIsAuth, setUser, loading: userLoading, fetchChats, fetchUsers } = useAppData();
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState<string>('');
  const [resendLoading, setResendLoading] = useState(false);
  const searchParams = useSearchParams();
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const router = useRouter();

  const email: string = searchParams.get('email') || '';

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  useEffect(() => {
    if (isAuth && !userLoading) {
      router.push('/chat');
    }
  }, [isAuth, userLoading, router]);

  const handleInputChange = (index: number, value: string): void => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>): void => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const digits = pastedData.replace(/\D/g, '').slice(0, 6);
    if (digits.length === 6) {
      const newOtp = digits.split('');
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const { data } = await axios.post(`${user_service}/api/v1/verify`, {
        email,
        otp: otpString,
      });
      toast.success(data.message);
      Cookies.set('token', data.token, {
        expires: 15,
        secure: false,
        path: '/',
      });
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      setUser(data.user);
      setIsAuth(true);
      await fetchChats();
      await fetchUsers();
      router.push('/chat');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendingOtp = async () => {
    setResendLoading(true);
    setError('');

    try {
      const { data } = await axios.post(`${user_service}/api/v1/login`, {
        email,
      });
      toast.success(data.message);
      setTimer(60);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend code');
    } finally {
      setResendLoading(false);
    }
  };

  if (userLoading) return <Loading />;
  if (isAuth) return null;

  return (
    <div className="min-h-screen bg-[#0b141a] flex items-center justify-center p-4">
      <div className="fixed top-0 left-0 right-0 h-32 bg-[#00a884]/20 -z-0 pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        <div className="bg-[#111b21] border border-[#222e35] rounded-xl p-8 shadow-2xl relative">
          <button
            onClick={() => router.push('/login')}
            className="absolute top-6 left-6 p-2 text-[#8696a0] hover:text-[#e9edef] hover:bg-[#202c33] rounded-full transition-colors"
            title="Back to login"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-emerald-600/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-5 border border-emerald-500/30 shadow-inner">
              <Lock size={30} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#e9edef] mb-2 tracking-tight">
              Verify Your Email
            </h1>
            <p className="text-[#8696a0] text-sm">We sent a 6-digit verification code to</p>
            <p className="text-emerald-400 font-medium text-sm mt-0.5">{email || 'your email'}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#8696a0] mb-4 text-center">
                Enter 6-digit code
              </label>
              <div className="flex justify-center gap-2 sm:gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el: HTMLInputElement | null) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="w-11 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold border border-[#222e35] rounded-lg bg-[#202c33] text-[#e9edef] focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-center">
                <p className="text-red-400 text-xs font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg font-semibold text-sm hover:bg-emerald-500 transition-all shadow-md active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Verify and Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#8696a0] text-xs mb-2">Didn't receive the code?</p>
            {timer > 0 ? (
              <p className="text-[#8696a0] text-xs font-medium">
                Resend code in <span className="text-emerald-400">{timer}s</span>
              </p>
            ) : (
              <button
                className="text-emerald-400 hover:text-emerald-300 font-semibold text-xs disabled:opacity-50 transition-colors cursor-pointer"
                disabled={resendLoading}
                onClick={handleResendingOtp}
              >
                {resendLoading ? 'Sending...' : 'Resend Code'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;