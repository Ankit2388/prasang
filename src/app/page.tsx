'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { businessService } from '@/services/business.service';
import { Business } from '@/types/business.types';
import { VendorCard } from '@/components/shared/vendor-card';
import { EstimationModal } from '@/components/shared/estimation-modal';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/language-context';
import {
  Search,
  Sparkles,
  ArrowRight,
  Utensils,
  Compass,
  Soup,
  Coffee,
  Flame,
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBusinessForEstimation, setSelectedBusinessForEstimation] =
    useState<Business | null>(null);

  // Fetch featured businesses
  const { data, isLoading } = useQuery({
    queryKey: ['featured-businesses'],
    queryFn: () => businessService.getBusinesses({ limit: 6 }),
  });

  const featuredBusinesses = data?.businesses || [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/vendors?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/vendors');
    }
  };

  const popularCuisines = [
    {
      name: 'Gujarati',
      title: 'Traditional Gujarati Feast',
      desc: 'Undhiyu, Puri, Shrikhand, Dal-Dhokli & Farsan',
      icon: <Soup className="w-6 h-6 text-amber-600" />,
      bg: 'from-amber-50 to-orange-50 border-amber-200',
    },
    {
      name: 'North Indian',
      title: 'Royal North Indian & Mughlai',
      desc: 'Shahi Paneer, Dal Makhani, Biryani & Naans',
      icon: <Flame className="w-6 h-6 text-red-600" />,
      bg: 'from-orange-50 to-red-50 border-orange-200',
    },
    {
      name: 'Chinese',
      title: 'Indo-Chinese & Oriental',
      desc: 'Hakka Noodles, Manchurian, Dimsums & Spring Rolls',
      icon: <Utensils className="w-6 h-6 text-emerald-600" />,
      bg: 'from-emerald-50 to-teal-50 border-emerald-200',
    },
    {
      name: 'South Indian',
      title: 'South Indian Specialties',
      desc: 'Crispy Dosas, Idli-Vada Platter, Pongal & Filter Kaapi',
      icon: <Coffee className="w-6 h-6 text-sky-600" />,
      bg: 'from-blue-50 to-indigo-50 border-blue-200',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 🌟 HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 bg-linear-to-b from-[var(--app-surface-2)]/80 via-[var(--app-background)] to-[var(--app-background)] border-b border-[var(--app-border)]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--app-primary-100)] text-[var(--app-primary)] text-xs font-bold border border-[var(--app-primary)]/20 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gujarat & India&apos;s Leading Event Catering Network</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[var(--app-text-primary)] tracking-tight leading-tight">
              {t('home.heroTitle')}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-[var(--app-text-secondary)] leading-relaxed max-w-2xl mx-auto">
              {t('home.heroSubtitle')}
            </p>

            {/* Prominent Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="mt-8 flex flex-col sm:flex-row items-stretch gap-2.5 max-w-2xl mx-auto p-2 rounded-2xl bg-[var(--app-surface)] border border-[var(--app-border)] shadow-md transition-shadow focus-within:ring-2 focus-within:ring-[var(--app-primary)]/20"
            >
              <div className="relative flex-1 flex items-center">
                <Search className="w-5 h-5 text-[var(--app-text-muted)] absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('home.searchPlaceholder')}
                  className="w-full pl-11 pr-4 py-3 text-sm text-[var(--app-text-primary)] placeholder-[var(--app-text-muted)] bg-transparent focus:outline-none"
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="rounded-xl shadow-xs shrink-0"
              >
                <span>{t('vendors.title')}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </form>

            {/* Quick City & Cuisine Tags */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs text-[var(--app-text-muted)]">
              <span>Quick Explore:</span>
              {['Ahmedabad', 'Surat', 'Vadodara', 'Gujarati', 'North Indian'].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() =>
                    router.push(
                      `/vendors?${
                        ['Ahmedabad', 'Surat', 'Vadodara'].includes(item) ? 'city' : 'cuisine'
                      }=${encodeURIComponent(item)}`
                    )
                  }
                  className="px-2.5 py-1 rounded-lg bg-[var(--app-surface)] border border-[var(--app-border)] text-[var(--app-text-secondary)] hover:text-[var(--app-primary)] hover:border-[var(--app-primary)] transition-colors cursor-pointer"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 📊 PLATFORM STATS */}
      <section className="border-b border-[var(--app-border)] bg-[var(--app-surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-2xl sm:text-3xl font-black text-[var(--app-primary)]">100+</p>
              <p className="text-xs text-[var(--app-text-muted)] font-medium mt-1">
                {t('home.statsCaterers')}
              </p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-[var(--app-primary)]">15+</p>
              <p className="text-xs text-[var(--app-text-muted)] font-medium mt-1">
                {t('home.statsCities')}
              </p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-[var(--app-primary)]">1,200+</p>
              <p className="text-xs text-[var(--app-text-muted)] font-medium mt-1">
                {t('home.statsEvents')}
              </p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-[var(--app-primary)]">4.9 ★</p>
              <p className="text-xs text-[var(--app-text-muted)] font-medium mt-1">
                {t('home.statsSatisfaction')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 🍲 POPULAR CUISINES */}
      <section className="py-16 sm:py-20 bg-[var(--app-background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-[var(--app-primary)] uppercase tracking-wider">
                Culinary Traditions
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[var(--app-text-primary)] tracking-tight mt-1">
                {t('home.popularCuisines')}
              </h2>
            </div>
            <Link href="/vendors">
              <Button variant="outline" size="sm">
                <span>{t('home.viewAll')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {popularCuisines.map((c) => (
              <div
                key={c.name}
                onClick={() => router.push(`/vendors?cuisine=${encodeURIComponent(c.name)}`)}
                className={`p-6 rounded-2xl bg-linear-to-br ${c.bg} border cursor-pointer hover:shadow-md transition-all duration-300 hover:-translate-y-1`}
              >
                <div className="w-12 h-12 rounded-xl bg-white shadow-2xs flex items-center justify-center mb-4">
                  {c.icon}
                </div>
                <h3 className="text-base font-bold text-[var(--app-text-primary)]">
                  {c.title}
                </h3>
                <p className="text-xs text-[var(--app-text-secondary)] mt-1.5 leading-relaxed">
                  {c.desc}
                </p>
                <div className="mt-4 flex items-center text-xs font-bold text-[var(--app-primary)] gap-1">
                  <span>Explore Caterers</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🏆 FEATURED CATERERS */}
      <section className="py-16 sm:py-20 border-t border-[var(--app-border)] bg-[var(--app-surface-2)]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-[var(--app-primary)] uppercase tracking-wider">
                Handpicked Partners
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[var(--app-text-primary)] tracking-tight mt-1">
                {t('home.featuredVendors')}
              </h2>
              <p className="text-xs text-[var(--app-text-muted)] mt-1">
                {t('home.featuredSubtitle')}
              </p>
            </div>
            <Link href="/vendors">
              <Button variant="primary" size="md">
                <span>{t('home.exploreButton')}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-80 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] animate-pulse p-4 space-y-4"
                >
                  <div className="h-44 bg-[var(--app-surface-2)] rounded-xl" />
                  <div className="h-4 bg-[var(--app-surface-2)] rounded w-3/4" />
                  <div className="h-4 bg-[var(--app-surface-2)] rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : featuredBusinesses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredBusinesses.map((b) => (
                <VendorCard
                  key={b.id}
                  business={b}
                  onRequestEstimation={(selected) => setSelectedBusinessForEstimation(selected)}
                />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)]">
              <p className="text-sm text-[var(--app-text-muted)]">
                No caterers available right now. Check back shortly.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 🧭 HOW IT WORKS */}
      <section className="py-16 sm:py-24 bg-[var(--app-background)] border-t border-[var(--app-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-bold text-[var(--app-primary)] uppercase tracking-wider">
              Effortless Booking
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[var(--app-text-primary)] tracking-tight">
              {t('home.howItWorks')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-[var(--app-surface)] border border-[var(--app-border)] shadow-xs relative space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--app-primary-100)] text-[var(--app-primary)] font-black text-lg flex items-center justify-center">
                1
              </div>
              <h3 className="text-lg font-bold text-[var(--app-text-primary)]">
                {t('home.step1Title')}
              </h3>
              <p className="text-xs text-[var(--app-text-secondary)] leading-relaxed">
                {t('home.step1Desc')}
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[var(--app-surface)] border border-[var(--app-border)] shadow-xs relative space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--app-primary-100)] text-[var(--app-primary)] font-black text-lg flex items-center justify-center">
                2
              </div>
              <h3 className="text-lg font-bold text-[var(--app-text-primary)]">
                {t('home.step2Title')}
              </h3>
              <p className="text-xs text-[var(--app-text-secondary)] leading-relaxed">
                {t('home.step2Desc')}
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[var(--app-surface)] border border-[var(--app-border)] shadow-xs relative space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--app-primary-100)] text-[var(--app-primary)] font-black text-lg flex items-center justify-center">
                3
              </div>
              <h3 className="text-lg font-bold text-[var(--app-text-primary)]">
                {t('home.step3Title')}
              </h3>
              <p className="text-xs text-[var(--app-text-secondary)] leading-relaxed">
                {t('home.step3Desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 💬 BOTTOM CTA BANNER */}
      <section className="bg-linear-to-r from-[var(--app-primary)] to-[var(--app-primary-hover)] text-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
            Planning a Wedding, Reception, or Corporate Event?
          </h2>
          <p className="text-sm sm:text-base text-white/90 max-w-2xl mx-auto leading-relaxed">
            Connect with top-rated caterers, review custom menu packages, and receive transparent pricing estimates today.
          </p>
          <div className="pt-2">
            <Link href="/vendors">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-[var(--app-primary)] hover:bg-neutral-100 shadow-md"
              >
                <Compass className="w-4 h-4 mr-1.5" />
                <span>Explore All Caterers Now</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Estimation Modal */}
      <EstimationModal
        isOpen={!!selectedBusinessForEstimation}
        onClose={() => setSelectedBusinessForEstimation(null)}
        business={selectedBusinessForEstimation}
      />
    </div>
  );
}
