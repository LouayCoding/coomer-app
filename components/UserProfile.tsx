'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface UserData {
  discord_id: string;
  discord_username: string;
  discord_avatar: string | null;
  subscription: {
    status: string;
    expires_at: string;
    days_left: number;
  } | null;
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

  const handleLogout = () => {
    document.cookie = 'discord_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push('/login');
  };

  if (loading || !user) {
    return null;
  }

  const avatarUrl = user.discord_avatar
    ? `https://cdn.discordapp.com/avatars/${user.discord_id}/${user.discord_avatar}.png`
    : `https://cdn.discordapp.com/embed/avatars/${parseInt(user.discord_id) % 5}.png`;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        <div className="relative w-8 h-8 rounded-full overflow-hidden">
          <Image
            src={avatarUrl}
            alt={user.discord_username}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
        <span className="text-white text-sm font-medium hidden sm:block">
          {user.discord_username}
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
          <div className="absolute right-0 mt-2 w-64 bg-[#1a1a1a] rounded-lg shadow-lg z-50 py-2">
            <div className="px-4 py-3 border-b border-[#2a2a2a]">
              <div className="flex items-center gap-3 mb-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={avatarUrl}
                    alt={user.discord_username}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div>
                  <p className="text-white font-semibold">{user.discord_username}</p>
                  <p className="text-gray-400 text-xs">Discord ID: {user.discord_id}</p>
                </div>
              </div>

              {user.subscription ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Status</span>
                    <span className="text-green-500 text-sm font-medium flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Expires</span>
                    <span className="text-white text-sm font-medium">
                      {formatDate(user.subscription.expires_at)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Days Left</span>
                    <span className={`text-sm font-medium ${
                      user.subscription.days_left > 7 ? 'text-green-500' : 
                      user.subscription.days_left > 3 ? 'text-yellow-500' : 
                      'text-red-500'
                    }`}>
                      {user.subscription.days_left} days
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-2">
                  <p className="text-gray-400 text-sm">No active subscription</p>
                </div>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-gray-400 hover:text-white hover:bg-[#2a2a2a] transition-colors text-sm"
            >
              Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
