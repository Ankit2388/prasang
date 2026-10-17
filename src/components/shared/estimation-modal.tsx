'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Business } from '@/types/business.types';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { useLanguage } from '@/context/language-context';
import { vendorService } from '@/services/vendor.service';
import { CheckCircle2, Lock, Calendar, Users, Send } from 'lucide-react';

interface EstimationModalProps {
  isOpen: boolean;
  onClose: () => void;
  business: Business | null;
}

export function EstimationModal({ isOpen, onClose, business }: EstimationModalProps) {
  const router = useRouter();
  const { user, isAuthenticated, setPreservedAction } = useAuth();
  const { t } = useLanguage();

  const [guestCount, setGuestCount] = useState<number>(200);
  const [eventDate, setEventDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedRequestId, setSubmittedRequestId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [todayStr, setTodayStr] = useState<string>('');

  React.useEffect(() => {
    setTodayStr(new Date().toISOString().split('T')[0]);
  }, []);

  if (!business) return null;

  const handleAuthRedirect = (target: 'login' | 'register') => {
    // Preserve customer's intended action
    setPreservedAction({
      type: 'ESTIMATION_REQUEST',
      businessId: business.id,
      vendorId: business.vendorId,
      businessName: business.businessName,
      guestCount,
      eventDate,
      notes,
    });
    onClose();
    router.push(`/${target}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestCount || !eventDate) {
      setErrorMessage('Please fill in both the guest count and event date.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const result = await vendorService.requestEstimation({
        vendorId: business.vendorId,
        guestCount: Number(guestCount),
        eventDate,
        preservedActionContext: notes || `Catering inquiry for ${business.businessName}`,
      });

      setSubmittedRequestId(result.requestId);
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setErrorMessage((err as any)?.message || 'Failed to submit estimation request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSubmittedRequestId(null);
    setErrorMessage(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t('estimation.modalTitle')}
      description={t('estimation.modalSubtitle', { vendorName: business.businessName })}
      maxWidth="md"
    >
      {submittedRequestId ? (
        <div className="py-6 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h4 className="text-lg font-bold text-[var(--app-text-primary)]">
            {t('estimation.successTitle')}
          </h4>
          <p className="text-xs text-[var(--app-text-secondary)] leading-relaxed max-w-sm mx-auto">
            {t('estimation.successDesc', {
              vendorName: business.businessName,
              requestId: submittedRequestId,
            })}
          </p>
          <div className="pt-4">
            <Button variant="primary" size="md" onClick={handleClose}>
              {t('common.close')}
            </Button>
          </div>
        </div>
      ) : !isAuthenticated ? (
        <div className="py-4 space-y-5">
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
            <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs font-bold">{t('estimation.authRequiredTitle')}</h5>
              <p className="text-xs text-amber-800 mt-1">
                {t('estimation.authRequiredDesc')}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              variant="primary"
              size="md"
              className="w-full"
              onClick={() => handleAuthRedirect('login')}
            >
              {t('estimation.signInToContinue')}
            </Button>
            <Button
              variant="outline"
              size="md"
              className="w-full"
              onClick={() => handleAuthRedirect('register')}
            >
              {t('estimation.createAccount')}
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
              {errorMessage}
            </div>
          )}

          <div className="p-3 rounded-xl bg-[var(--app-surface-2)] border border-[var(--app-border)] flex items-center justify-between text-xs">
            <span className="text-[var(--app-text-muted)]">Submitting as:</span>
            <span className="font-bold text-[var(--app-text-primary)]">
              {user?.firstName} {user?.lastName} ({user?.mobileNumber})
            </span>
          </div>

          <Input
            label={t('estimation.guestCountLabel')}
            type="number"
            min={10}
            max={10000}
            required
            value={guestCount}
            onChange={(e) => setGuestCount(Number(e.target.value))}
            placeholder={t('estimation.guestCountPlaceholder')}
            leftIcon={<Users className="w-4 h-4" />}
          />

          <Input
            label={t('estimation.eventDateLabel')}
            type="date"
            required
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            leftIcon={<Calendar className="w-4 h-4" />}
            min={todayStr || undefined}
          />

          <Textarea
            label={t('estimation.contextLabel')}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t('estimation.contextPlaceholder')}
            rows={3}
          />

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--app-border)]">
            <Button variant="ghost" size="md" type="button" onClick={handleClose}>
              {t('common.cancel')}
            </Button>
            <Button
              variant="primary"
              size="md"
              type="submit"
              isLoading={isSubmitting}
              leftIcon={<Send className="w-4 h-4" />}
            >
              {isSubmitting ? t('estimation.submitting') : t('estimation.submitBtn')}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
