'use client';

import React from 'react';
import Link from 'next/link';
import { Business } from '@/types/business.types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/language-context';
import {
  MapPin,
  Users,
  Star,
  Utensils,
  ChevronRight,
  Calculator,
} from 'lucide-react';

interface VendorCardProps {
  business: Business;
  onRequestEstimation?: (business: Business) => void;
}

export function VendorCard({ business, onRequestEstimation }: VendorCardProps) {
  const { t } = useLanguage();

  const minGuests = business.capacity?.minGuests || 50;
  const maxGuests = business.capacity?.maxGuests || 2000;
  const rating = business.averageRating || 4.8; // Fallback to realistic display if 0
  const reviewCount = business.totalReviews || 12;

  // Cuisine badges
  const cuisines = business.cuisineTypes?.length
    ? business.cuisineTypes
    : ['Multi-Cuisine', 'Vegetarian Feast'];

  return (
    <Card className="group overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300 hover:border-[var(--app-primary)]/40 bg-[var(--app-surface)]">
      {/* Card Header / Image Banner */}
      <div className="relative h-48 w-full bg-linear-to-br from-[var(--app-surface-2)] to-[var(--app-primary-100)] flex items-center justify-center overflow-hidden">
        {business.coverImage && !business.coverImage.includes('example.com') ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={business.coverImage}
            alt={business.businessName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-white/80 shadow-xs flex items-center justify-center text-[var(--app-primary)] group-hover:scale-110 transition-transform">
              <Utensils className="w-7 h-7" />
            </div>
            <span className="text-xs font-bold text-[var(--app-text-secondary)] uppercase tracking-wider">
              {cuisines.slice(0, 2).join(' • ')}
            </span>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <Badge variant="primary" size="sm" className="backdrop-blur-md font-semibold">
            {t('common.pureVeg')}
          </Badge>
        </div>

        {/* Rating Floating Tag */}
        <div className="absolute top-3 right-3 z-10">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/95 backdrop-blur-md shadow-xs border border-amber-200">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="text-xs font-bold text-[var(--app-text-primary)]">
              {rating.toFixed(1)}
            </span>
            <span className="text-[10px] text-[var(--app-text-muted)]">
              ({reviewCount})
            </span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Title */}
          <Link href={`/vendors/${business.id}`}>
            <h3 className="text-base font-bold text-[var(--app-text-primary)] hover:text-[var(--app-primary)] transition-colors line-clamp-1">
              {business.businessName}
            </h3>
          </Link>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-[var(--app-text-muted)] mt-1.5">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-[var(--app-primary)]" />
            <span className="line-clamp-1">
              {business.city ? `${business.city}, ${business.state || 'India'}` : 'Ahmedabad, Gujarat'}
            </span>
          </div>

          {/* Description */}
          {business.description && (
            <p className="text-xs text-[var(--app-text-secondary)] mt-2.5 line-clamp-2 leading-relaxed">
              {business.description}
            </p>
          )}

          {/* Cuisine Tags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {cuisines.map((cuisine) => (
              <span
                key={cuisine}
                className="px-2 py-0.5 rounded-lg text-[11px] font-medium bg-[var(--app-surface-2)] text-[var(--app-text-secondary)] border border-[var(--app-border)]"
              >
                {cuisine}
              </span>
            ))}
          </div>
        </div>

        {/* Capacity & Action Buttons */}
        <div className="pt-3 border-t border-[var(--app-border)] space-y-3">
          <div className="flex items-center justify-between text-xs text-[var(--app-text-secondary)]">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[var(--app-text-muted)]" />
              <span>{t('vendors.guestsRange', { min: minGuests, max: maxGuests })}</span>
            </div>
            <span className="text-[11px] font-semibold text-[var(--app-primary)]">
              Catering Available
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link href={`/vendors/${business.id}`} className="w-full">
              <Button variant="outline" size="sm" className="w-full text-xs">
                <span>{t('vendors.viewMenu')}</span>
                <ChevronRight className="w-3 h-3" />
              </Button>
            </Link>

            <Button
              variant="primary"
              size="sm"
              className="w-full text-xs"
              onClick={() => onRequestEstimation && onRequestEstimation(business)}
            >
              <Calculator className="w-3 h-3" />
              <span>{t('vendors.requestQuote')}</span>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
