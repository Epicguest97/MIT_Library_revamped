import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google'; // Assuming Geist font usage
import { Toaster } from "@/components/ui/toaster"; // Import Toaster
import './globals.css';
import { cn } from "@/lib/utils"; // Import cn utility

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'LinkFinder', // Updated App Name
  description: 'Find links based on hierarchical categories.', // Updated description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning> {/* Added suppressHydrationWarning for potential theme issues */}
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased", // Use geistSans by default
          geistSans.variable,
          geistMono.variable
        )}
      >
        {children}
        <Toaster /> {/* Add Toaster component */}
      </body>
    </html>
  );
}
