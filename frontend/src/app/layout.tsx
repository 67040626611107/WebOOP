import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Popcat Game - Click the Cat!',
  description: 'A fun clicking game with global leaderboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
