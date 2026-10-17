'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { useLanguage } from '@/context/language-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { UtensilsCrossed, ArrowRight, User, Phone, Lock, Mail } from 'lucide-react';

export default function CustomerRegisterPage() {
  const router = useRouter();
  const { register, preservedAction } = useAuth();
  const { t } = useLanguage();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !mobileNumber || !password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      await register({
        firstName,
        lastName,
        mobileNumber,
        password,
        email: email.trim() || undefined,
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (preservedAction && (preservedAction as any)?.businessId) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        router.push(`/vendors/${(preservedAction as any).businessId}`);
      } else {
        router.push('/vendors');
      }
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setErrorMessage((err as any)?.message || 'Failed to create account. Please check your details.');
    } finally {
      setIsLoading(false);
    }
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
          {t('auth.registerTitle')}
        </h2>
        <p className="text-xs text-[var(--app-text-secondary)] max-w-sm mx-auto">
          {t('auth.registerSubtitle')}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Card className="p-6 sm:p-8 space-y-6 shadow-sm">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label={t('auth.firstName')}
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder={t('auth.firstNamePlaceholder')}
                leftIcon={<User className="w-4 h-4" />}
              />

              <Input
                label={t('auth.lastName')}
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder={t('auth.lastNamePlaceholder')}
              />
            </div>

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
              helperText="Minimum 6 characters"
            />

            <Input
              label={t('auth.email')}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('auth.emailPlaceholder')}
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full shadow-xs mt-2"
              isLoading={isLoading}
            >
              {isLoading ? t('auth.registering') : t('auth.registerButton')}
            </Button>
          </form>

          {/* Links & Guest Skip */}
          <div className="pt-4 border-t border-[var(--app-border)] space-y-3 text-center text-xs">
            <p className="text-[var(--app-text-secondary)]">
              {t('auth.haveAccount')}{' '}
              <Link href="/login" className="font-bold text-[var(--app-primary)] hover:underline">
                {t('auth.loginLink')}
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
