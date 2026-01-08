'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import UserProfile from './UserProfile';

export default function Header() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Posts' },
    { href: '/popular', label: 'Popular' },
    { href: '/creators', label: 'Creators' },
    { href: '/history', label: 'History' },
  ];

  return (
    <header className="bg-[#0a0a0a]/80 backdrop-blur-lg sticky top-0 z-30" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingLeft: 'max(1rem, env(safe-area-inset-left))', paddingRight: 'max(1rem, env(safe-area-inset-right))' }}>
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#ff6b00] to-[#ff9000] flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-black font-bold text-lg sm:text-xl">C</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold gradient-text">
              COOMER
            </h1>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 xl:px-6 py-2.5 text-gray-300 hover:text-white hover:bg-[#1a1a1a] rounded-xl transition-all font-medium ${
                  pathname === item.href
                    ? 'bg-[#ff9000] text-black font-semibold'
                    : ''
                }`}
              >
                {item.label}
              </Link>
            ))}
            <UserProfile />
          </nav>
        </div>
      </div>
    </header>
  );
}
