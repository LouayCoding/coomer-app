'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if already logged in
    const session = document.cookie
      .split('; ')
      .find(row => row.startsWith('discord_session='));
    
    if (session) {
      router.push('/');
    }
  }, [router]);

  const handleDiscordLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
    const redirectUri = encodeURIComponent(
      `${window.location.origin}/auth/callback`
    );
    const scope = encodeURIComponent('identify email');

    window.location.href = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome to <span className="text-[#ff9000]">Coomer</span>
          </h1>
          <p className="text-gray-400">
            Sign in with Discord to access the platform
          </p>
        </div>

        {/* Discord Login Button */}
        <button
          onClick={handleDiscordLogin}
          className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-3 mb-6"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
          </svg>
          Sign in with Discord
        </button>

        {/* Info */}
        <div className="space-y-2">
          <h3 className="text-white font-medium mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#ff9000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            How to get access
          </h3>
          <div className="text-gray-400 text-sm space-y-2">
            <p className="flex gap-2">
              <span className="text-[#ff9000] font-semibold">1.</span>
              <span>Join our Discord server</span>
            </p>
            <p className="flex gap-2">
              <span className="text-[#ff9000] font-semibold">2.</span>
              <span>Use <code className="text-[#ff9000]">/ticket</code> command to create a payment ticket</span>
            </p>
            <p className="flex gap-2">
              <span className="text-[#ff9000] font-semibold">3.</span>
              <span>Complete payment and upload proof</span>
            </p>
            <p className="flex gap-2">
              <span className="text-[#ff9000] font-semibold">4.</span>
              <span>Admin will verify and grant access</span>
            </p>
            <p className="flex gap-2">
              <span className="text-[#ff9000] font-semibold">5.</span>
              <span>Sign in here with Discord</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
