'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { businessService } from '@/services/business.service';
import { Business } from '@/types/business.types';
import { VendorCard } from '@/components/shared/vendor-card';
import { EmptyState } from '@/components/shared/empty-state';
import { EstimationModal } from '@/components/shared/estimation-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { useLanguage } from '@/context/language-context';
import {
  Search,
  Filter,
  X,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Star,
  Users,
  MapPin,
  Utensils,
} from 'lucide-react';

function VendorListingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();

  // URL state readers
  const initialSearch = searchParams.get('search') || '';
  const initialCity = searchParams.get('city') || '';
  const initialCuisine = searchParams.get('cuisine') || '';
  const initialMinRating = searchParams.get('minRating') || '';
  const initialMinCapacity = searchParams.get('minCapacity') || '';
  const initialMaxCapacity = searchParams.get('maxCapacity') || '';
  const initialPage = Number(searchParams.get('page')) || 1;
  const initialSort = searchParams.get('sort') || 'rating';

  // Filter and search states
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [city, setCity] = useState(initialCity);
  const [cuisine, setCuisine] = useState(initialCuisine);
  const [minRating, setMinRating] = useState(initialMinRating);
  const [minCapacity, setMinCapacity] = useState(initialMinCapacity);
  const [maxCapacity, setMaxCapacity] = useState(initialMaxCapacity);
  const [page, setPage] = useState(initialPage);
  const [sortBy, setSortBy] = useState(initialSort);

  // Mobile filters drawer
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Estimation modal state
  const [selectedForEstimation, setSelectedForEstimation] = useState<Business | null>(null);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Sync to URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch.trim()) params.set('search', debouncedSearch.trim());
    if (city) params.set('city', city);
    if (cuisine) params.set('cuisine', cuisine);
    if (minRating) params.set('minRating', minRating);
    if (minCapacity) params.set('minCapacity', minCapacity);
    if (maxCapacity) params.set('maxCapacity', maxCapacity);
    if (page > 1) params.set('page', String(page));
    if (sortBy !== 'rating') params.set('sort', sortBy);

    const queryString = params.toString();
    const targetUrl = queryString ? `/vendors?${queryString}` : '/vendors';
    router.replace(targetUrl, { scroll: false });
  }, [debouncedSearch, city, cuisine, minRating, minCapacity, maxCapacity, page, sortBy, router]);

  // Fetch businesses with backend query filters
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: [
      'businesses-discovery',
      debouncedSearch,
      city,
      cuisine,
      minRating,
      minCapacity,
      maxCapacity,
      page,
    ],
    queryFn: () =>
      businessService.getBusinesses({
        search: debouncedSearch || undefined,
        city: city || undefined,
        cuisine: cuisine || undefined,
        minRating: minRating ? Number(minRating) : undefined,
        minCapacity: minCapacity ? Number(minCapacity) : undefined,
        maxCapacity: maxCapacity ? Number(maxCapacity) : undefined,
        page,
        limit: 9,
      }),
  });

  const businesses = useMemo(() => {
    if (!data?.businesses) return [];
    const list = [...data.businesses];

    // Client-side sort options enhancement
    if (sortBy === 'rating') {
      return list.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
    }
    if (sortBy === 'newest') {
      return list.sort(
        (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
    }
    if (sortBy === 'name') {
      return list.sort((a, b) => a.businessName.localeCompare(b.businessName));
    }
    return list;
  }, [data, sortBy]);

  const pagination = data?.pagination || { total: 0, page: 1, limit: 9, totalPages: 1 };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchInput('');
    setDebouncedSearch('');
    setCity('');
    setCuisine('');
    setMinRating('');
    setMinCapacity('');
    setMaxCapacity('');
    setPage(1);
    setSortBy('rating');
  };

  // Check if any filter is active
  const hasActiveFilters = Boolean(
    debouncedSearch || city || cuisine || minRating || minCapacity || maxCapacity
  );

  const cityOptions = [
    { value: '', label: t('vendors.filterCityAll') },
    { value: 'Ahmedabad', label: 'Ahmedabad' },
    { value: 'Surat', label: 'Surat' },
    { value: 'Vadodara', label: 'Vadodara' },
    { value: 'Rajkot', label: 'Rajkot' },
    { value: 'Gandhinagar', label: 'Gandhinagar' },
    { value: 'Mumbai', label: 'Mumbai' },
  ];

  const cuisineOptions = [
    { value: '', label: t('vendors.filterCuisineAll') },
    { value: 'Gujarati', label: 'Gujarati' },
    { value: 'North Indian', label: 'North Indian' },
    { value: 'Chinese', label: 'Chinese' },
    { value: 'South Indian', label: 'South Indian' },
    { value: 'Continental', label: 'Continental' },
    { value: 'Street Food & Chaat', label: 'Street Food & Chaat' },
  ];

  const ratingOptions = [
    { value: '', label: t('vendors.filterRatingAll') },
    { value: '4.5', label: '4.5★ & Above' },
    { value: '4', label: t('vendors.filterRating4Plus') },
    { value: '3', label: t('vendors.filterRating3Plus') },
  ];

  const sortOptions = [
    { value: 'rating', label: t('vendors.sortRatingHigh') },
    { value: 'newest', label: t('vendors.sortNewest') },
    { value: 'name', label: t('vendors.sortNameAZ') },
  ];

  return (
    <div className="min-h-screen bg-[var(--app-background)] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb & Title */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-4xl font-black text-[var(--app-text-primary)] tracking-tight">
            {t('vendors.title')}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--app-text-secondary)] mt-1.5">
            {t('vendors.subtitle')}
          </p>
        </div>

        {/* Top Control Bar: Search Input, Mobile Filter Trigger, Sort */}
        <div className="p-4 rounded-2xl bg-[var(--app-surface)] border border-[var(--app-border)] shadow-xs mb-6 space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input with Debounce & Clear */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[var(--app-text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={t('common.search')}
                className="w-full rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-2)] pl-10 pr-9 py-2.5 text-sm text-[var(--app-text-primary)] placeholder-[var(--app-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--app-primary)]/20 focus:border-[var(--app-primary)]"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-[var(--app-text-muted)] hover:text-[var(--app-text-primary)] cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Actions (Filter toggle on mobile + Sorting) */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="md"
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex-1 sm:flex-none"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>{t('vendors.filtersTitle')}</span>
                {hasActiveFilters && (
                  <span className="w-2 h-2 rounded-full bg-[var(--app-primary)]" />
                )}
              </Button>

              <div className="w-48">
                <Select
                  options={sortOptions}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-xs py-2 bg-[var(--app-surface-2)]"
                />
              </div>
            </div>
          </div>

          {/* Active Filter Pills Bar */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[var(--app-border)] text-xs">
              <span className="font-semibold text-[var(--app-text-muted)]">Active Filters:</span>

              {debouncedSearch && (
                <Badge variant="primary" size="sm" className="gap-1">
                  <span>Search: &quot;{debouncedSearch}&quot;</span>
                  <button
                    onClick={() => setSearchInput('')}
                    className="hover:opacity-75 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}

              {city && (
                <Badge variant="neutral" size="sm" className="gap-1">
                  <span>City: {city}</span>
                  <button onClick={() => setCity('')} className="hover:opacity-75 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}

              {cuisine && (
                <Badge variant="neutral" size="sm" className="gap-1">
                  <span>Cuisine: {cuisine}</span>
                  <button
                    onClick={() => setCuisine('')}
                    className="hover:opacity-75 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}

              {minRating && (
                <Badge variant="gold" size="sm" className="gap-1">
                  <span>Rating: {minRating}★+</span>
                  <button
                    onClick={() => setMinRating('')}
                    className="hover:opacity-75 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}

              {(minCapacity || maxCapacity) && (
                <Badge variant="neutral" size="sm" className="gap-1">
                  <span>
                    Guests: {minCapacity || '0'} - {maxCapacity || 'Any'}
                  </span>
                  <button
                    onClick={() => {
                      setMinCapacity('');
                      setMaxCapacity('');
                    }}
                    className="hover:opacity-75 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}

              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-[var(--app-primary)] hover:underline flex items-center gap-1 font-semibold ml-auto cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{t('vendors.clearFilters')}</span>
              </button>
            </div>
          )}
        </div>

        {/* Main Content Layout: Sidebar Filters (Desktop) + Vendor Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* DESKTOP FILTERS SIDEBAR */}
          <aside className="hidden lg:block lg:col-span-1 space-y-6">
            <div className="p-5 rounded-2xl bg-[var(--app-surface)] border border-[var(--app-border)] shadow-xs space-y-5 sticky top-24">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--app-border)]">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[var(--app-primary)]" />
                  <h3 className="text-sm font-bold text-[var(--app-text-primary)]">
                    {t('vendors.filtersTitle')}
                  </h3>
                </div>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="text-xs text-[var(--app-primary)] hover:underline cursor-pointer"
                  >
                    {t('common.reset')}
                  </button>
                )}
              </div>

              {/* City Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--app-text-secondary)] uppercase flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[var(--app-primary)]" />
                  <span>{t('vendors.filterCity')}</span>
                </label>
                <Select
                  options={cityOptions}
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                    setPage(1);
                  }}
                />
              </div>

              {/* Cuisine Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--app-text-secondary)] uppercase flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5 text-[var(--app-primary)]" />
                  <span>{t('vendors.filterCuisine')}</span>
                </label>
                <Select
                  options={cuisineOptions}
                  value={cuisine}
                  onChange={(e) => {
                    setCuisine(e.target.value);
                    setPage(1);
                  }}
                />
              </div>

              {/* Rating Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--app-text-secondary)] uppercase flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>{t('vendors.filterRating')}</span>
                </label>
                <Select
                  options={ratingOptions}
                  value={minRating}
                  onChange={(e) => {
                    setMinRating(e.target.value);
                    setPage(1);
                  }}
                />
              </div>

              {/* Guest Capacity Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--app-text-secondary)] uppercase flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[var(--app-primary)]" />
                  <span>{t('vendors.filterCapacity')}</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder={t('vendors.filterMinCapacity')}
                    value={minCapacity}
                    onChange={(e) => {
                      setMinCapacity(e.target.value);
                      setPage(1);
                    }}
                    className="text-xs py-2"
                  />
                  <Input
                    type="number"
                    placeholder={t('vendors.filterMaxCapacity')}
                    value={maxCapacity}
                    onChange={(e) => {
                      setMaxCapacity(e.target.value);
                      setPage(1);
                    }}
                    className="text-xs py-2"
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* VENDORS GRID & RESULTS */}
          <div className="lg:col-span-3 space-y-6">
            {/* Status Bar */}
            <div className="flex items-center justify-between text-xs text-[var(--app-text-muted)]">
              <span>
                {t('vendors.resultsCount', { count: pagination.total || businesses.length })}
              </span>
              {isFetching && (
                <div className="flex items-center gap-1.5 text-[var(--app-primary)]">
                  <Spinner size="sm" />
                  <span>Updating results...</span>
                </div>
              )}
            </div>

            {/* Content States */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
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
            ) : isError ? (
              <EmptyState
                icon={<RotateCcw className="w-8 h-8" />}
                title="Failed to Load Caterers"
                description={t('vendors.errorLoading')}
                actionLabel={t('common.retry')}
                onAction={() => refetch()}
              />
            ) : businesses.length === 0 ? (
              <EmptyState
                icon={<Utensils className="w-8 h-8" />}
                title={t('vendors.noResultsTitle')}
                description={t('vendors.noResultsDesc')}
                actionLabel={t('vendors.clearFilters')}
                onAction={handleResetFilters}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {businesses.map((business) => (
                  <VendorCard
                    key={business.id}
                    business={business}
                    onRequestEstimation={(b) => setSelectedForEstimation(b)}
                  />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between pt-6 border-t border-[var(--app-border)]">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  leftIcon={<ChevronLeft className="w-4 h-4" />}
                >
                  Previous
                </Button>

                <span className="text-xs font-semibold text-[var(--app-text-secondary)]">
                  Page {pagination.page} of {pagination.totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  rightIcon={<ChevronRight className="w-4 h-4" />}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE FILTERS MODAL / SHEET */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="relative w-full max-h-[85vh] overflow-y-auto rounded-t-3xl bg-[var(--app-surface)] border-t border-[var(--app-border)] p-6 space-y-5 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--app-border)]">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[var(--app-primary)]" />
                <h3 className="text-base font-bold text-[var(--app-text-primary)]">
                  {t('vendors.filtersTitle')}
                </h3>
              </div>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-1 rounded-lg text-[var(--app-text-muted)] hover:text-[var(--app-text-primary)] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* City Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[var(--app-text-secondary)] uppercase">
                {t('vendors.filterCity')}
              </label>
              <Select
                options={cityOptions}
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            {/* Cuisine Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[var(--app-text-secondary)] uppercase">
                {t('vendors.filterCuisine')}
              </label>
              <Select
                options={cuisineOptions}
                value={cuisine}
                onChange={(e) => {
                  setCuisine(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            {/* Rating Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[var(--app-text-secondary)] uppercase">
                {t('vendors.filterRating')}
              </label>
              <Select
                options={ratingOptions}
                value={minRating}
                onChange={(e) => {
                  setMinRating(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            {/* Capacity Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[var(--app-text-secondary)] uppercase">
                {t('vendors.filterCapacity')}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder={t('vendors.filterMinCapacity')}
                  value={minCapacity}
                  onChange={(e) => {
                    setMinCapacity(e.target.value);
                    setPage(1);
                  }}
                  className="text-xs py-2"
                />
                <Input
                  type="number"
                  placeholder={t('vendors.filterMaxCapacity')}
                  value={maxCapacity}
                  onChange={(e) => {
                    setMaxCapacity(e.target.value);
                    setPage(1);
                  }}
                  className="text-xs py-2"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-[var(--app-border)] grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  handleResetFilters();
                  setMobileFiltersOpen(false);
                }}
              >
                {t('common.reset')}
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => setMobileFiltersOpen(false)}
              >
                {t('common.apply')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Estimation Request Modal */}
      <EstimationModal
        isOpen={!!selectedForEstimation}
        onClose={() => setSelectedForEstimation(null)}
        business={selectedForEstimation}
      />
    </div>
  );
}

export default function VendorListingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      }
    >
      <VendorListingContent />
    </Suspense>
  );
}
