'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/language-context';
import { UtensilsCrossed, Heart, ShieldCheck, Clock, Award } from 'lucide-react';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-text-secondary)] mt-auto">
      {/* Value Proposition Highlights */}
      <div className="border-b border-[var(--app-border)] bg-[var(--app-surface-2)]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[var(--app-primary-100)] text-[var(--app-primary)] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[var(--app-text-primary)]">Verified Caterers</h4>
                <p className="text-xs text-[var(--app-text-muted)]">Strict hygiene and quality audits</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[var(--app-primary-100)] text-[var(--app-primary)] flex items-center justify-center shrink-0">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[var(--app-text-primary)]">Custom Feasts</h4>
                <p className="text-xs text-[var(--app-text-muted)]">Multi-course curated menus</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[var(--app-primary-100)] text-[var(--app-primary)] flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[var(--app-text-primary)]">Quick Estimations</h4>
                <p className="text-xs text-[var(--app-text-muted)]">Direct responses from caterers</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[var(--app-primary-100)] text-[var(--app-primary)] flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[var(--app-text-primary)]">Honest Reviews</h4>
                <p className="text-xs text-[var(--app-text-muted)]">Genuine client ratings & feedback</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[var(--app-primary)] flex items-center justify-center text-white shadow-xs">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
              <span className="text-xl font-black tracking-tight text-[var(--app-text-primary)]">
                {t('common.appName')}
              </span>
            </Link>
            <p className="text-xs text-[var(--app-text-muted)] leading-relaxed">
              {t('common.subtagline')}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[var(--app-text-primary)] uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-[var(--app-primary)] transition-colors">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link href="/vendors" className="hover:text-[var(--app-primary)] transition-colors">
                  {t('nav.explore')}
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-[var(--app-primary)] transition-colors">
                  {t('nav.login')}
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-[var(--app-primary)] transition-colors">
                  {t('nav.register')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Cuisines */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[var(--app-text-primary)] uppercase tracking-wider">
              Popular Cuisines
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/vendors?cuisine=Gujarati" className="hover:text-[var(--app-primary)] transition-colors">
                  Traditional Gujarati
                </Link>
              </li>
              <li>
                <Link href="/vendors?cuisine=North+Indian" className="hover:text-[var(--app-primary)] transition-colors">
                  Royal North Indian & Punjabi
                </Link>
              </li>
              <li>
                <Link href="/vendors?cuisine=Chinese" className="hover:text-[var(--app-primary)] transition-colors">
                  Oriental & Indo-Chinese
                </Link>
              </li>
              <li>
                <Link href="/vendors?cuisine=South+Indian" className="hover:text-[var(--app-primary)] transition-colors">
                  South Indian Delicacies
                </Link>
              </li>
            </ul>
          </div>

          {/* For Caterers & Partners */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[var(--app-text-primary)] uppercase tracking-wider">
              For Caterers
            </h4>
            <p className="text-xs text-[var(--app-text-muted)] leading-relaxed">
              Are you an event caterer or banquet manager? Expand your client bookings with Prasang.
            </p>
            <div className="pt-1">
              <a
                href="http://localhost:3000"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--app-primary)] hover:underline"
              >
                <span>Access Prasang Vendor Portal</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-[var(--app-border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--app-text-muted)]">
          <p>© 2026 Prasang. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-current inline" />
            <span>for joyous celebrations and magnificent feasts.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
