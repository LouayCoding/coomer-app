'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Creator } from '@/types/api';

interface LinkedAccountsProps {
  service: string;
  creatorId: string;
}

const serviceIcons: Record<string, string> = {
  onlyfans: '🔞',
  fansly: '💎',
  patreon: '🎨',
  fanbox: '📦',
  subscribestar: '⭐'
};

export default function LinkedAccounts({ service, creatorId }: LinkedAccountsProps) {
  const [linkedAccounts, setLinkedAccounts] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLinkedAccounts();
  }, [service, creatorId]);

  const fetchLinkedAccounts = async () => {
    try {
      const response = await fetch(`/api/links/${service}/${creatorId}`);
      const data = await response.json();
      
      if (data.data && Array.isArray(data.data)) {
        setLinkedAccounts(data.data);
      }
    } catch (error) {
      console.error('Error fetching linked accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || linkedAccounts.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="bg-gradient-to-br from-[#1a1a1a] to-[#151515] rounded-2xl p-6 border border-[#2a2a2a]">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-5 h-5 text-[#ff9000]" fill="currentColor" viewBox="0 0 20 20">
            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
          </svg>
          <h3 className="text-lg font-semibold text-white">
            Linked Accounts
          </h3>
          <span className="text-sm text-gray-400">
            ({linkedAccounts.length})
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {linkedAccounts.map((account) => {
            const accountId = account.public_id || account.id;
            const profileImageUrl = `https://img.coomer.st/icons/${account.service}/${accountId}`;
            
            return (
              <Link
                key={`${account.service}-${account.id}`}
                href={`/creator/${account.service}/${accountId}`}
                className="flex items-center gap-3 p-3 bg-[#0a0a0a] rounded-xl border border-[#2a2a2a] hover:border-[#ff9000] transition-all group"
              >
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#2a2a2a] group-hover:border-[#ff9000] transition-colors flex-shrink-0">
                  <Image
                    src={profileImageUrl}
                    alt={account.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                    loading="lazy"
                    quality={80}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(account.name)}&background=ff9000&color=000&size=128&bold=true`;
                    }}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{serviceIcons[account.service] || '🔗'}</span>
                    <h4 className="text-white font-medium truncate group-hover:text-[#ff9000] transition-colors">
                      {account.name}
                    </h4>
                  </div>
                  <p className="text-xs text-gray-400 capitalize">
                    {account.service}
                  </p>
                </div>

                <svg className="w-5 h-5 text-gray-500 group-hover:text-[#ff9000] transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
