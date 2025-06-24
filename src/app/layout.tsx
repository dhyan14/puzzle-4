import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tetromino Puzzle',
  description: 'Place 15 T-tetrominoes and 1 square tetromino on an 8x8 grid',
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