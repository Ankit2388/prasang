'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { businessService } from '@/services/business.service';
import { reviewService } from '@/services/review.service';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/spinner';
import { EmptyState } from '@/components/shared/empty-state';
import { EstimationModal } from '@/components/shared/estimation-modal';
import { useAuth } from '@/context/auth-context';
import { useLanguage } from '@/context/language-context';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  MapPin,
  Users,
  Star,
  Utensils,
  Phone,
  Mail,
  Globe,
  Clock,
  ArrowLeft,
  Calculator,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

function VendorDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();

  const businessId = params.id as string;

  // Active Tab: 'overview' | 'menus' | 'reviews'
  const [activeTab, setActiveTab] = useState<'overview' | 'menus' | 'reviews'>('overview');

  // Estimation Modal State
  const [isEstimationModalOpen, setIsEstimationModalOpen] = useState(false);

  // Review submission form state
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [reviewSuccessMessage, setReviewSuccessMessage] = useState<string | null>(null);

  // Fetch Business Details
  const {
    data: business,
    isLoading: isBusinessLoading,
    isError: isBusinessError,
  } = useQuery({
    queryKey: ['business-details', businessId],
    queryFn: () => businessService.getBusinessById(businessId),
    enabled: !!businessId,
  });

  // Fetch Business Reviews
  const {
    data: reviewsData,
    isLoading: isReviewsLoading,
  } = useQuery({
    queryKey: ['business-reviews', businessId],
    queryFn: () => reviewService.getReviewsByBusinessId(businessId),
    enabled: !!businessId,
  });

  // Create Review Mutation
  const createReviewMutation = useMutation({
    mutationFn: () =>
      reviewService.createReview({
        businessId,
        rating: reviewRating,
        comment: reviewComment,
      }),
    onSuccess: () => {
      setReviewComment('');
      setReviewRating(5);
      setReviewSuccessMessage(t('vendorDetails.reviewSuccess'));
      queryClient.invalidateQueries({ queryKey: ['business-reviews', businessId] });
      queryClient.invalidateQueries({ queryKey: ['business-details', businessId] });
      setTimeout(() => setReviewSuccessMessage(null), 5000);
    },
  });

  if (isBusinessLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--app-background)]">
        <div className="text-center space-y-3">
          <Spinner size="lg" />
          <p className="text-xs text-[var(--app-text-muted)] font-medium">
            Loading caterer profile...
          </p>
        </div>
      </div>
    );
  }

  if (isBusinessError || !business) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--app-background)]">
        <EmptyState
          icon={<Utensils className="w-10 h-10" />}
          title="Caterer Not Found"
          description="We couldn't retrieve the caterer profile you were looking for. It may have been updated or moved."
          actionLabel={t('common.backToVendors')}
          onAction={() => router.push('/vendors')}
        />
      </div>
    );
  }

  const cuisines = business.cuisineTypes?.length
    ? business.cuisineTypes
    : ['Multi-Cuisine', 'Traditional Indian'];

  const rating = business.averageRating || 4.8;
  const reviewCount = business.totalReviews || reviewsData?.reviews.length || 12;
  const minGuests = business.capacity?.minGuests || 50;
  const maxGuests = business.capacity?.maxGuests || 2000;
  const menus = business.menus || [];
  const reviews = reviewsData?.reviews || [];

  return (
    <div className="min-h-screen bg-[var(--app-background)] pb-16">
      {/* Top Breadcrumb Navigation */}
      <div className="border-b border-[var(--app-border)] bg-[var(--app-surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <Link
            href="/vendors"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--app-text-secondary)] hover:text-[var(--app-primary)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('common.backToVendors')}</span>
          </Link>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsEstimationModalOpen(true)}
            leftIcon={<Calculator className="w-3.5 h-3.5" />}
          >
            {t('vendors.requestQuote')}
          </Button>
        </div>
      </div>

      {/* Hero Profile Header */}
      <div className="relative bg-linear-to-b from-[var(--app-surface-2)] to-[var(--app-background)] border-b border-[var(--app-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="primary" size="sm" className="font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Prasang Caterer</span>
                </Badge>
                <Badge variant="success" size="sm">
                  {t('common.pureVeg')}
                </Badge>
                {business.city && (
                  <Badge variant="neutral" size="sm">
                    <MapPin className="w-3 h-3 text-[var(--app-primary)]" />
                    <span>{business.city}</span>
                  </Badge>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-4xl font-black text-[var(--app-text-primary)] tracking-tight">
                {business.businessName}
              </h1>

              {/* Description */}
              {business.description && (
                <p className="text-xs sm:text-sm text-[var(--app-text-secondary)] leading-relaxed">
                  {business.description}
                </p>
              )}

              {/* Quick Info Strip */}
              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-[var(--app-text-secondary)]">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="font-bold text-[var(--app-text-primary)] text-sm">
                    {rating.toFixed(1)}
                  </span>
                  <span className="text-[var(--app-text-muted)]">
                    ({reviewCount} verified reviews)
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[var(--app-primary)]" />
                  <span>{t('vendors.guestsRange', { min: minGuests, max: maxGuests })}</span>
                </div>

                {business.address && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[var(--app-primary)]" />
                    <span>{business.address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Estimation Card on Hero Right */}
            <Card className="w-full md:w-80 p-5 bg-[var(--app-surface)] shadow-sm border-[var(--app-primary)]/30 shrink-0">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 rounded-xl bg-[var(--app-primary-100)] text-[var(--app-primary)] flex items-center justify-center font-bold">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[var(--app-text-primary)] uppercase tracking-wide">
                    Fast Catering Quote
                  </h4>
                  <p className="text-[11px] text-[var(--app-text-muted)]">Direct response in 24 hours</p>
                </div>
              </div>
              <Button
                variant="primary"
                size="md"
                className="w-full"
                onClick={() => setIsEstimationModalOpen(true)}
              >
                {t('vendors.requestQuote')}
              </Button>
            </Card>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-[var(--app-border)] bg-[var(--app-surface)] sticky top-16 sm:top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 sm:gap-8 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`py-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'border-[var(--app-primary)] text-[var(--app-primary)]'
                  : 'border-transparent text-[var(--app-text-secondary)] hover:text-[var(--app-text-primary)]'
              }`}
            >
              {t('vendorDetails.tabOverview')}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('menus')}
              className={`py-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'menus'
                  ? 'border-[var(--app-primary)] text-[var(--app-primary)]'
                  : 'border-transparent text-[var(--app-text-secondary)] hover:text-[var(--app-text-primary)]'
              }`}
            >
              <span>{t('vendorDetails.tabMenus')}</span>
              {menus.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-[var(--app-primary-100)] text-[var(--app-primary)]">
                  {menus.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className={`py-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'reviews'
                  ? 'border-[var(--app-primary)] text-[var(--app-primary)]'
                  : 'border-transparent text-[var(--app-text-secondary)] hover:text-[var(--app-text-primary)]'
              }`}
            >
              <span>{t('vendorDetails.tabReviews')}</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-[var(--app-surface-2)] text-[var(--app-text-secondary)]">
                {reviews.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab Panels */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* About Section */}
              <Card className="p-6 space-y-4">
                <h3 className="text-base font-bold text-[var(--app-text-primary)]">
                  {t('vendorDetails.aboutTitle')}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--app-text-secondary)] leading-relaxed">
                  {business.description ||
                    'Royal Caterers provides premier catering services for weddings, receptions, and corporate galas with complete culinary perfection, customized menus, and professional on-site service.'}
                </p>

                <div className="pt-4 border-t border-[var(--app-border)] space-y-2">
                  <h4 className="text-xs font-bold text-[var(--app-text-secondary)] uppercase tracking-wide">
                    {t('vendorDetails.cuisinesOffered')}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {cuisines.map((c) => (
                      <Badge key={c} variant="neutral" size="md">
                        {c}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Guest Capacity Breakdown */}
              <Card className="p-6 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[var(--app-primary-100)] text-[var(--app-primary)] flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[var(--app-text-primary)]">
                      {t('vendorDetails.guestCapacityTitle')}
                    </h3>
                    <p className="text-xs text-[var(--app-text-muted)]">
                      {t('vendorDetails.minMaxGuests', { min: minGuests, max: maxGuests })}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-3">
                  <div className="p-4 rounded-xl bg-[var(--app-surface-2)] text-center">
                    <span className="text-[11px] text-[var(--app-text-muted)] uppercase">
                      Min Guests
                    </span>
                    <p className="text-xl font-black text-[var(--app-text-primary)] mt-1">
                      {minGuests}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-[var(--app-surface-2)] text-center">
                    <span className="text-[11px] text-[var(--app-text-muted)] uppercase">
                      Max Guests
                    </span>
                    <p className="text-xl font-black text-[var(--app-text-primary)] mt-1">
                      {maxGuests}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Menus Quick Snapshot */}
              {menus.length > 0 && (
                <Card className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-[var(--app-text-primary)]">
                      {t('vendorDetails.menusTitle')}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab('menus')}
                      className="text-xs font-semibold text-[var(--app-primary)] hover:underline cursor-pointer"
                    >
                      View All Menus & Dishes →
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {menus.map((menu) => (
                      <div
                        key={menu.id}
                        className="p-4 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-2)] space-y-2 cursor-pointer hover:border-[var(--app-primary)] transition-colors"
                        onClick={() => setActiveTab('menus')}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-[var(--app-text-primary)]">
                            {menu.name}
                          </h4>
                          <Badge variant="primary" size="sm">
                            {menu.category}
                          </Badge>
                        </div>
                        <p className="text-xs text-[var(--app-text-muted)] line-clamp-2">
                          {menu.description}
                        </p>
                        <div className="text-[11px] font-semibold text-[var(--app-primary)] pt-1">
                          {menu.items?.length || 0} {t('common.items')} included
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>

            {/* Right Sidebar: Contact & Consultation */}
            <div className="space-y-6">
              {/* Contact Card */}
              <Card className="p-6 space-y-4">
                <h3 className="text-sm font-bold text-[var(--app-text-primary)] uppercase tracking-wide">
                  {t('vendorDetails.contactTitle')}
                </h3>

                <div className="space-y-3 text-xs">
                  {business.contactInformation?.phone && (
                    <div className="flex items-center gap-3 text-[var(--app-text-secondary)]">
                      <div className="w-8 h-8 rounded-lg bg-[var(--app-surface-2)] flex items-center justify-center text-[var(--app-primary)]">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block text-[10px] text-[var(--app-text-muted)] uppercase">
                          {t('vendorDetails.phone')}
                        </span>
                        <a
                          href={`tel:${business.contactInformation.phone}`}
                          className="font-bold text-[var(--app-text-primary)] hover:text-[var(--app-primary)]"
                        >
                          {business.contactInformation.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {business.contactInformation?.email && (
                    <div className="flex items-center gap-3 text-[var(--app-text-secondary)]">
                      <div className="w-8 h-8 rounded-lg bg-[var(--app-surface-2)] flex items-center justify-center text-[var(--app-primary)]">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block text-[10px] text-[var(--app-text-muted)] uppercase">
                          {t('vendorDetails.email')}
                        </span>
                        <a
                          href={`mailto:${business.contactInformation.email}`}
                          className="font-bold text-[var(--app-text-primary)] hover:text-[var(--app-primary)]"
                        >
                          {business.contactInformation.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {business.contactInformation?.website && (
                    <div className="flex items-center gap-3 text-[var(--app-text-secondary)]">
                      <div className="w-8 h-8 rounded-lg bg-[var(--app-surface-2)] flex items-center justify-center text-[var(--app-primary)]">
                        <Globe className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block text-[10px] text-[var(--app-text-muted)] uppercase">
                          {t('vendorDetails.website')}
                        </span>
                        <a
                          href={business.contactInformation.website}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-[var(--app-primary)] hover:underline truncate block max-w-[180px]"
                        >
                          {business.contactInformation.website}
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {business.address && (
                  <div className="pt-3 border-t border-[var(--app-border)]">
                    <span className="block text-[10px] text-[var(--app-text-muted)] uppercase mb-1">
                      {t('vendorDetails.addressTitle')}
                    </span>
                    <p className="text-xs text-[var(--app-text-secondary)] leading-relaxed">
                      {business.address}, {business.city}, {business.state} {business.pincode}
                    </p>
                  </div>
                )}
              </Card>

              {/* Consultation Hours */}
              <Card className="p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[var(--app-primary)]" />
                  <h3 className="text-sm font-bold text-[var(--app-text-primary)] uppercase tracking-wide">
                    {t('vendorDetails.businessHours')}
                  </h3>
                </div>

                <div className="space-y-2 text-xs">
                  {business.businessHours && business.businessHours.length > 0 ? (
                    business.businessHours.map((h) => (
                      <div key={h.day} className="flex items-center justify-between py-1">
                        <span className="text-[var(--app-text-secondary)] font-medium capitalize">
                          {h.day.toLowerCase()}
                        </span>
                        {h.isOpen ? (
                          <span className="font-semibold text-[var(--app-text-primary)]">
                            {h.openingTime || '09:00 AM'} - {h.closingTime || '08:00 PM'}
                          </span>
                        ) : (
                          <span className="text-red-500 font-semibold">{t('vendorDetails.closed')}</span>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="space-y-1.5 text-[var(--app-text-secondary)]">
                      <div className="flex items-center justify-between">
                        <span>Monday - Saturday</span>
                        <span className="font-semibold text-[var(--app-text-primary)]">
                          09:00 AM - 08:00 PM
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Sunday</span>
                        <span className="font-semibold text-[var(--app-text-primary)]">
                          10:00 AM - 04:00 PM
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* TAB 2: MENUS & DISHES */}
        {activeTab === 'menus' && (
          <div className="space-y-8">
            {menus.length === 0 ? (
              <EmptyState
                icon={<Utensils className="w-8 h-8" />}
                title={t('vendorDetails.noMenus')}
                description="This caterer has not published menu packages yet. Request an estimate directly to get a custom quotation."
                actionLabel={t('vendors.requestQuote')}
                onAction={() => setIsEstimationModalOpen(true)}
              />
            ) : (
              menus.map((menu) => (
                <Card key={menu.id} className="p-6 space-y-6">
                  {/* Menu Package Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--app-border)]">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-[var(--app-text-primary)]">
                          {menu.name}
                        </h3>
                        <Badge variant="primary" size="sm">
                          {menu.category}
                        </Badge>
                      </div>
                      {menu.description && (
                        <p className="text-xs text-[var(--app-text-secondary)] mt-1 max-w-2xl leading-relaxed whitespace-pre-line">
                          {menu.description}
                        </p>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEstimationModalOpen(true)}
                    >
                      <Calculator className="w-3.5 h-3.5" />
                      <span>Inquire About Package</span>
                    </Button>
                  </div>

                  {/* Dishes in this Menu */}
                  {menu.items && menu.items.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {menu.items.map((item) => (
                        <div
                          key={item.id}
                          className="p-4 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-2)] flex flex-col justify-between space-y-3"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2">
                              <h4 className="text-sm font-bold text-[var(--app-text-primary)]">
                                {item.name}
                              </h4>
                              {item.isVegetarian && (
                                <span className="w-3.5 h-3.5 rounded-full border border-emerald-600 flex items-center justify-center shrink-0">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] font-semibold text-[var(--app-primary)] uppercase tracking-wide block mt-0.5">
                              {item.category}
                            </span>
                            {item.description && (
                              <p className="text-xs text-[var(--app-text-muted)] mt-1.5 line-clamp-2 leading-relaxed">
                                {item.description}
                              </p>
                            )}
                          </div>

                          <div className="pt-2 border-t border-[var(--app-border)] flex items-center justify-between text-xs">
                            <span className="font-bold text-[var(--app-text-primary)]">
                              {formatCurrency(item.price)}
                            </span>
                            <span className="text-[11px] text-[var(--app-text-muted)]">
                              {t('common.perPlate')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-[var(--app-text-muted)] italic">
                      {t('vendorDetails.noMenuItems')}
                    </p>
                  )}
                </Card>
              ))
            )}
          </div>
        )}

        {/* TAB 3: REVIEWS & TESTIMONIALS */}
        {activeTab === 'reviews' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Reviews List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[var(--app-text-primary)]">
                  {t('vendorDetails.reviewsTitle')}
                </h3>
                <span className="text-xs text-[var(--app-text-muted)]">
                  {reviews.length} {t('common.reviews')}
                </span>
              </div>

              {isReviewsLoading ? (
                <div className="space-y-4">
                  {[1, 2].map((n) => (
                    <div
                      key={n}
                      className="h-28 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] animate-pulse p-4 space-y-3"
                    >
                      <div className="h-4 bg-[var(--app-surface-2)] rounded w-1/4" />
                      <div className="h-4 bg-[var(--app-surface-2)] rounded w-3/4" />
                    </div>
                  ))}
                </div>
              ) : reviews.length === 0 ? (
                <Card className="p-8 text-center space-y-3">
                  <Star className="w-8 h-8 text-amber-400 mx-auto" />
                  <p className="text-sm font-bold text-[var(--app-text-primary)]">
                    {t('vendorDetails.noReviews')}
                  </p>
                  <p className="text-xs text-[var(--app-text-muted)]">
                    Submit your feedback below to help other event hosts.
                  </p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {reviews.map((r) => {
                    const authorName =
                      typeof r.userId === 'object' && r.userId !== null
                        ? `${r.userId.firstName} ${r.userId.lastName}`
                        : 'Verified Host';

                    return (
                      <Card key={r.id} className="p-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-[var(--app-primary-100)] text-[var(--app-primary)] flex items-center justify-center font-bold text-xs">
                              {authorName[0]}
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-[var(--app-text-primary)]">
                                {authorName}
                              </h4>
                              <span className="text-[10px] text-[var(--app-text-muted)]">
                                {formatDate(r.createdAt)}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-3.5 h-3.5 ${
                                  star <= r.rating
                                    ? 'text-amber-500 fill-amber-500'
                                    : 'text-neutral-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        {r.comment && (
                          <p className="text-xs text-[var(--app-text-secondary)] leading-relaxed">
                            {r.comment}
                          </p>
                        )}
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Write a Review Section */}
            <div className="space-y-6">
              <Card className="p-6 space-y-4 sticky top-36">
                <h3 className="text-sm font-bold text-[var(--app-text-primary)] uppercase tracking-wide">
                  {t('vendorDetails.writeReview')}
                </h3>

                {reviewSuccessMessage ? (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>{reviewSuccessMessage}</span>
                  </div>
                ) : !isAuthenticated ? (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-3">
                    <p>Please sign in to submit a review for this caterer.</p>
                    <Link href="/login">
                      <Button variant="primary" size="sm" className="w-full">
                        Sign In to Review
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      createReviewMutation.mutate();
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-xs font-semibold text-[var(--app-text-secondary)] mb-1.5 uppercase">
                        {t('vendorDetails.reviewRatingLabel')}
                      </label>
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewRating(star)}
                            className="p-1 text-amber-500 cursor-pointer transition-transform hover:scale-110"
                          >
                            <Star
                              className={`w-6 h-6 ${
                                star <= reviewRating ? 'fill-amber-500' : 'text-neutral-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <Textarea
                      label={t('vendorDetails.reviewCommentLabel')}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder={t('vendorDetails.reviewCommentPlaceholder')}
                      rows={4}
                      required
                    />

                    <Button
                      variant="primary"
                      size="md"
                      type="submit"
                      className="w-full"
                      isLoading={createReviewMutation.isPending}
                    >
                      {t('vendorDetails.submitReview')}
                    </Button>
                  </form>
                )}
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Estimation Modal */}
      <EstimationModal
        isOpen={isEstimationModalOpen}
        onClose={() => setIsEstimationModalOpen(false)}
        business={business}
      />
    </div>
  );
}

export default function VendorDetailsPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[var(--app-background)]">
          <Spinner size="lg" />
        </div>
      }
    >
      <VendorDetailsContent />
    </React.Suspense>
  );
}
