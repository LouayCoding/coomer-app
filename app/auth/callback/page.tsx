'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This page is no longer used - redirect to login
export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login page since we no longer use Discord OAuth
    router.push('/login');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#ff9000] mb-4"></div>
        <p className="text-white text-lg">Redirecting...</p>
      </div>
    </div>
  );
}
