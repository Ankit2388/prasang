'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { useLanguage } from '@/context/language-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { UtensilsCrossed, ArrowRight, Sparkles, Phone, Lock } from 'lucide-react';

export default function CustomerLoginPage() {
  const router = useRouter();
  const { login, preservedAction } = useAuth();
  const { t } = useLanguage();

  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileNumber || !password) {
      setErrorMessage('Please enter both your mobile number and password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      await login({ mobileNumber, password });

      // If customer had an action preserved (like estimation request for a vendor), return to vendor
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (preservedAction && (preservedAction as any)?.businessId) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        router.push(`/vendors/${(preservedAction as any).businessId}`);
      } else {
        router.push('/vendors');
      }
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setErrorMessage((err as any)?.message || 'Invalid credentials or mobile number.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoFill = () => {
    setMobileNumber('9999999999');
    setPassword('password123');
    setErrorMessage(null);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[var(--app-background)]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div className="w-11 h-11 rounded-2xl bg-[var(--app-primary)] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tight text-[var(--app-text-primary)]">
            {t('common.appName')}
          </span>
        </Link>
        <h2 className="text-2xl font-black text-[var(--app-text-primary)] tracking-tight">
          {t('auth.loginTitle')}
        </h2>
        <p className="text-xs text-[var(--app-text-secondary)] max-w-sm mx-auto">
          {t('auth.loginSubtitle')}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Card className="p-6 sm:p-8 space-y-6 shadow-sm">
          {/* Demo fast-fill shortcut */}
          <div className="p-3 rounded-xl bg-[var(--app-primary-100)]/70 border border-[var(--app-primary)]/20 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-[var(--app-primary)] font-semibold">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>Quick Test Account</span>
            </div>
            <button
              type="button"
              onClick={handleDemoFill}
              className="text-xs font-bold text-[var(--app-primary)] hover:underline cursor-pointer"
            >
              Fill Credentials
            </button>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={t('auth.mobileNumber')}
              type="tel"
              required
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              placeholder={t('auth.mobilePlaceholder')}
              leftIcon={<Phone className="w-4 h-4" />}
            />

            <Input
              label={t('auth.password')}
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('auth.passwordPlaceholder')}
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full shadow-xs"
              isLoading={isLoading}
            >
              {isLoading ? t('auth.signingIn') : t('auth.signInButton')}
            </Button>
          </form>

          {/* Links & Guest Skip */}
          <div className="pt-4 border-t border-[var(--app-border)] space-y-3 text-center text-xs">
            <p className="text-[var(--app-text-secondary)]">
              {t('auth.noAccount')}{' '}
              <Link
                href="/register"
                className="font-bold text-[var(--app-primary)] hover:underline"
              >
                {t('auth.registerLink')}
              </Link>
            </p>

            <div>
              <Link
                href="/vendors"
                className="text-[var(--app-text-muted)] hover:text-[var(--app-primary)] inline-flex items-center gap-1 font-medium hover:underline transition-colors"
              >
                <span>{t('auth.skipToBrowse')}</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
