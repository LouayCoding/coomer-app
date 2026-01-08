'use client';

import { useRouter } from 'next/navigation';

export default function NoAccessPage() {
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = 'discord_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        {/* Icon */}
        <div className="w-16 h-16 bg-[#ff9000]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-[#ff9000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white text-center mb-2">
          Access Required
        </h1>
        <p className="text-gray-400 text-center mb-8">
          You need an active subscription to access this platform
        </p>

        {/* Steps */}
        <div className="space-y-3 mb-8">
          <div className="p-4">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 bg-[#ff9000] rounded-full flex items-center justify-center text-black text-sm font-bold flex-shrink-0">1</span>
              <div>
                <h3 className="text-white font-medium mb-1">Join Discord Server</h3>
                <p className="text-gray-400 text-sm">Join our Discord community to get started</p>
              </div>
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 bg-[#ff9000] rounded-full flex items-center justify-center text-black text-sm font-bold flex-shrink-0">2</span>
              <div>
                <h3 className="text-white font-medium mb-1">Create Payment Ticket</h3>
                <p className="text-gray-400 text-sm">Use <code className="text-[#ff9000]">/ticket</code> command in Discord</p>
              </div>
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 bg-[#ff9000] rounded-full flex items-center justify-center text-black text-sm font-bold flex-shrink-0">3</span>
              <div>
                <h3 className="text-white font-medium mb-1">Complete Payment</h3>
                <p className="text-gray-400 text-sm">Follow payment instructions and upload proof</p>
              </div>
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 bg-[#ff9000] rounded-full flex items-center justify-center text-black text-sm font-bold flex-shrink-0">4</span>
              <div>
                <h3 className="text-white font-medium mb-1">Get Verified</h3>
                <p className="text-gray-400 text-sm">Admin will verify and grant access within 24 hours</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <a
            href="https://discord.gg/your-invite-link"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold py-3 px-6 rounded-lg transition-colors text-center"
          >
            Join Discord Server
          </a>
          <button
            onClick={handleLogout}
            className="w-full text-gray-400 hover:text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
