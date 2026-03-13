import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'Patient Directory Assignment',
  description:
    'A Next.js frontend assignment with a local API, search, filters, sorting, pagination, and both card and row views.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
