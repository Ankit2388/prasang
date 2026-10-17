'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { useLanguage } from '@/context/language-context';
import { ThemeToggle, LanguageToggle } from './theme-language-toggles';
import { Button } from '@/components/ui/button';
import {
  UtensilsCrossed,
  User as UserIcon,
  LogOut,
  Menu as MenuIcon,
  X,
  Compass,
  Home as HomeIcon,
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--app-border)] bg-[var(--app-surface)]/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Branding */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-[var(--app-primary)] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-[var(--app-text-primary)]">
                  {t('common.appName')}
                </span>
                <span className="text-[10px] font-semibold text-[var(--app-primary)] uppercase tracking-wider -mt-1">
                  Catering Discovery
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/"
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                  isActive('/') && pathname === '/'
                    ? 'bg-[var(--app-primary-100)] text-[var(--app-primary)]'
                    : 'text-[var(--app-text-secondary)] hover:text-[var(--app-text-primary)] hover:bg-[var(--app-surface-2)]'
                }`}
              >
                <HomeIcon className="w-4 h-4" />
                <span>{t('nav.home')}</span>
              </Link>
              <Link
                href="/vendors"
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                  isActive('/vendors')
                    ? 'bg-[var(--app-primary-100)] text-[var(--app-primary)]'
                    : 'text-[var(--app-text-secondary)] hover:text-[var(--app-text-primary)] hover:bg-[var(--app-surface-2)]'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>{t('nav.explore')}</span>
              </Link>
            </nav>
          </div>

          {/* Right Header Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />
            <LanguageToggle />

            <div className="h-6 w-px bg-[var(--app-border)] mx-1" />

            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--app-surface-2)] border border-[var(--app-border)]">
                  <div className="w-7 h-7 rounded-lg bg-[var(--app-primary-100)] text-[var(--app-primary)] flex items-center justify-center font-bold text-xs">
                    {user.firstName[0]}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-[var(--app-text-primary)] leading-tight">
                      {user.firstName} {user.lastName}
                    </span>
                    <span className="text-[10px] text-[var(--app-text-muted)] leading-tight">
                      {user.mobileNumber}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => logout()}
                  title={t('nav.logout')}
                  className="text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden xl:inline">{t('nav.logout')}</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    <UserIcon className="w-4 h-4" />
                    <span>{t('nav.login')}</span>
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm">
                    <span>{t('nav.register')}</span>
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <LanguageToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[var(--app-text-primary)] hover:bg-[var(--app-surface-2)] border border-[var(--app-border)]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[var(--app-border)] bg-[var(--app-surface)] px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-2">
          <nav className="space-y-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold ${
                isActive('/') && pathname === '/'
                  ? 'bg-[var(--app-primary-100)] text-[var(--app-primary)]'
                  : 'text-[var(--app-text-primary)] hover:bg-[var(--app-surface-2)]'
              }`}
            >
              <HomeIcon className="w-4 h-4" />
              <span>{t('nav.home')}</span>
            </Link>
            <Link
              href="/vendors"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold ${
                isActive('/vendors')
                  ? 'bg-[var(--app-primary-100)] text-[var(--app-primary)]'
                  : 'text-[var(--app-text-primary)] hover:bg-[var(--app-surface-2)]'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>{t('nav.explore')}</span>
            </Link>
          </nav>

          <div className="pt-2 border-t border-[var(--app-border)] flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--app-text-secondary)]">Theme</span>
            <ThemeToggle />
          </div>

          <div className="pt-2 border-t border-[var(--app-border)]">
            {isAuthenticated && user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[var(--app-surface-2)]">
                  <div className="w-8 h-8 rounded-lg bg-[var(--app-primary-100)] text-[var(--app-primary)] flex items-center justify-center font-bold text-sm">
                    {user.firstName[0]}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-[var(--app-text-primary)]">
                      {user.firstName} {user.lastName}
                    </span>
                    <span className="text-xs text-[var(--app-text-muted)]">
                      {user.mobileNumber}
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="md"
                  className="w-full text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t('nav.logout')}</span>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="md" className="w-full">
                    {t('nav.login')}
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="md" className="w-full">
                    {t('nav.register')}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
