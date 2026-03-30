'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export function NavBar() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && pathname !== '/login') {
      router.push('/login');
    }
  }, [loading, user, pathname, router]);

  const displayName =
    user && user.username.length > 20
      ? user.username.slice(0, 20) + '…'
      : user?.username;

  return (
    <header className="border-b">
      <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
        <a href="/" className="font-bold text-lg">Feature Voting</a>
        <div className="flex items-center gap-3">
          {displayName && (
            <span className="text-sm text-muted-foreground" title={user?.username}>
              {displayName}
            </span>
          )}
          {user && (
            <>
              <a
                href="/features/new"
                className="text-sm bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:opacity-90 transition-opacity"
              >
                + Submit Feature
              </a>
              <button
                onClick={() => { logout(); router.push('/login'); }}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Sign out
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
