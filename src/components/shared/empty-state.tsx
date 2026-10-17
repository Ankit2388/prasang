'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed border-[var(--app-border)] bg-[var(--app-surface)]/50">
      {icon && (
        <div className="w-16 h-16 rounded-2xl bg-[var(--app-primary-100)] text-[var(--app-primary)] flex items-center justify-center mb-4 shadow-2xs">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-bold text-[var(--app-text-primary)]">{title}</h3>
      <p className="text-sm text-[var(--app-text-secondary)] max-w-md mt-1.5 mb-6">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
