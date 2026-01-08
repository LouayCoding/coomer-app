'use client';

import { useState, useEffect } from 'react';

interface Announcement {
  id: string;
  content: string;
  published: string;
}

interface AnnouncementsProps {
  service: string;
  creatorId: string;
  creatorName: string;
}

export default function Announcements({ service, creatorId, creatorName }: AnnouncementsProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchAnnouncements();
    loadDismissedAnnouncements();
  }, [service, creatorId]);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch(`/api/announcements/${service}/${creatorId}`);
      const data = await response.json();
      
      if (data.data && Array.isArray(data.data)) {
        setAnnouncements(data.data);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDismissedAnnouncements = () => {
    const stored = localStorage.getItem(`dismissed-announcements-${service}-${creatorId}`);
    if (stored) {
      setDismissed(new Set(JSON.parse(stored)));
    }
  };

  const dismissAnnouncement = (id: string) => {
    const newDismissed = new Set(dismissed);
    newDismissed.add(id);
    setDismissed(newDismissed);
    localStorage.setItem(
      `dismissed-announcements-${service}-${creatorId}`,
      JSON.stringify(Array.from(newDismissed))
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const visibleAnnouncements = announcements.filter(a => !dismissed.has(a.id));

  if (loading || visibleAnnouncements.length === 0) {
    return null;
  }

  return (
    <div className="mb-8 space-y-4">
      {visibleAnnouncements.map((announcement) => (
        <div
          key={announcement.id}
          className="bg-gradient-to-r from-[#ff9000]/10 to-[#ff6b00]/10 border-l-4 border-[#ff9000] rounded-lg p-6 relative"
        >
          <button
            onClick={() => dismissAnnouncement(announcement.id)}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            aria-label="Dismiss announcement"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ff6b00] to-[#ff9000] flex items-center justify-center">
                <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
              </div>
            </div>

            <div className="flex-1 pr-8">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-white font-semibold text-lg">
                  Announcement from {creatorName}
                </h3>
                <span className="text-xs text-gray-400">
                  {formatDate(announcement.published)}
                </span>
              </div>
              
              <div 
                className="text-gray-300 prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: announcement.content }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
