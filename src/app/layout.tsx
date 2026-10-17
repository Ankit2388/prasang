import type { Metadata } from 'next';
import './globals.css';
import React, { Suspense } from 'react';
import { AppProviders } from '@/providers/app-providers';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

export const metadata: Metadata = {
  title: 'Prasang — Discover, Search & Book Premier Event Caterers',
  description:
    'Discover verified caterers for weddings, receptions, and corporate galas. Explore menus, pricing per plate, cuisine specialties, and request custom catering estimates.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="prasang" suppressHydrationWarning>
      <body className="min-h-screen bg-[var(--app-background)] text-[var(--app-text-primary)] antialiased flex flex-col">
        <AppProviders>
          <Suspense fallback={<header className="h-16 sm:h-20 border-b border-[var(--app-border)] bg-[var(--app-surface)]" />}>
            <Navbar />
          </Suspense>
          <main className="flex-1">{children}</main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
