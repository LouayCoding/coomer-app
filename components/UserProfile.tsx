'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface UserData {
  code: string;
  note: string | null;
  subscription: {
    status: string;
    expires_at: string;
    days_left: number;
  };
  device: {
    fingerprint: string;
    registered_at: string;
    last_seen: string;
  };
  limits: {
    max_devices: number;
    used_devices: number;
  };
}

export default function UserProfile() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/user');
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/user', { method: 'DELETE' });
    } catch (error) {
      console.error('Logout error:', error);
    }
    // Clear cookie client-side as backup
    document.cookie = 'access_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push('/login');
  };

  if (loading || !user) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('nl-NL', { 
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const isExpiringSoon = user.subscription.days_left <= 7;
  const isExpired = user.subscription.days_left <= 0;

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity px-3 py-2 rounded-lg hover:bg-[#1a1a1a]"
      >
        {/* Status indicator */}
        <div className={`w-2 h-2 rounded-full ${
          isExpired ? 'bg-red-500' : 
          isExpiringSoon ? 'bg-yellow-500' : 
          'bg-green-500'
        }`} />
        
        <span className="text-white text-sm font-medium hidden sm:block">
          {user.subscription.days_left > 0 
            ? `${user.subscription.days_left}d left` 
            : 'Expired'}
        </span>
        
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showDropdown && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute right-0 mt-2 w-72 bg-[#1a1a1a] rounded-xl shadow-lg z-50 py-2 border border-[#2a2a2a]">
            {/* Header */}
            <div className="px-4 py-3 border-b border-[#2a2a2a]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#ff6b00] to-[#ff9000] flex items-center justify-center">
                  <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-semibold">Access Code</p>
                  <p className="text-[#ff9000] text-sm font-mono">{user.code}</p>
                </div>
              </div>

              {user.note && (
                <p className="text-gray-400 text-xs mb-3">
                  Note: {user.note}
                </p>
              )}

              {/* Subscription Status */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Status</span>
                  <span className={`text-sm font-medium flex items-center gap-1 ${
                    isExpired ? 'text-red-500' : 
                    isExpiringSoon ? 'text-yellow-500' : 
                    'text-green-500'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${
                      isExpired ? 'bg-red-500' : 
                      isExpiringSoon ? 'bg-yellow-500' : 
                      'bg-green-500'
                    }`}></span>
                    {isExpired ? 'Expired' : 'Active'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Verloopt</span>
                  <span className="text-white text-sm font-medium">
                    {formatDate(user.subscription.expires_at)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Dagen over</span>
                  <span className={`text-sm font-medium ${
                    isExpired ? 'text-red-500' : 
                    isExpiringSoon ? 'text-yellow-500' : 
                    'text-green-500'
                  }`}>
                    {user.subscription.days_left > 0 
                      ? `${user.subscription.days_left} dagen` 
                      : 'Verlopen'}
                  </span>
                </div>
              </div>
            </div>

            {/* Device Info */}
            <div className="px-4 py-3 border-b border-[#2a2a2a]">
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Device</p>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Device ID</span>
                  <span className="text-white text-sm font-mono">{user.device.fingerprint}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Devices</span>
                  <span className="text-white text-sm">
                    {user.limits.used_devices}/{user.limits.max_devices}
                  </span>
                </div>
              </div>
            </div>

            {/* Warning if expiring soon */}
            {isExpiringSoon && !isExpired && (
              <div className="px-4 py-3 border-b border-[#2a2a2a]">
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-3 py-2">
                  <p className="text-yellow-500 text-xs">
                    ⚠️ Je toegang verloopt binnenkort. Neem contact op om te verlengen.
                  </p>
                </div>
              </div>
            )}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 text-left text-gray-400 hover:text-white hover:bg-[#2a2a2a] transition-colors text-sm flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Uitloggen
            </button>
          </div>
        </>
      )}
    </div>
  );
}
