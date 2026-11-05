"use client";
import { useAppData, user_service } from '@/context/AppContext';
import axios from 'axios';
import { ArrowRight, Loader2, MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Loading from "@/components/loading";
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const { isAuth, loading: userLoading } = useAppData();

  useEffect(() => {
    if (isAuth && !userLoading) {
      router.push("/chat");
    }
  }, [isAuth, userLoading, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(`${user_service}/api/v1/login`, {
        email,
      });
      toast.success(data.message);
      router.push(`/verify?email=${encodeURIComponent(email)}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  if (userLoading) return <Loading />;
  if (isAuth) return null;

  return (
    <div className="min-h-screen bg-[#0b141a] flex items-center justify-center p-4">
      {/* Background emerald top banner inspired by WhatsApp Web */}
      <div className="fixed top-0 left-0 right-0 h-32 bg-[#00a884]/20 -z-0 pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        <div className="bg-[#111b21] border border-[#222e35] rounded-xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-emerald-600/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-5 border border-emerald-500/30 shadow-inner">
              <MessageSquare size={32} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#e9edef] mb-2 tracking-tight">
              Welcome to WhatsApp Web
            </h1>
            <p className="text-[#8696a0] text-sm leading-relaxed">
              Enter your email address to log in or create your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-[#8696a0] mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-3 bg-[#202c33] border border-[#222e35] rounded-lg text-[#e9edef] placeholder-[#8696a0] text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg font-semibold text-sm hover:bg-emerald-500 transition-all shadow-md active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending verification code...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[#8696a0] mt-6">
          Simple. Reliable. Private.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;