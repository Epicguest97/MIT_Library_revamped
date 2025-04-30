import type { Metadata } from 'next';
import { Inter, Roboto_Mono } from 'next/font/google'; // Use standard Google Fonts
import { Toaster } from "@/components/ui/toaster";
import './globals.css';
import { cn } from "@/lib/utils";

// Initialize standard Google Fonts
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans', // Use standard variable name
});

const roboto_mono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono', // Use standard variable name
});

export const metadata: Metadata = {
  title: 'LinkFinder',
  description: 'Find links based on hierarchical categories.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Apply font variables to the html tag
    <html lang="en" suppressHydrationWarning className={cn(inter.variable, roboto_mono.variable)}>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased" // font-sans will now use Inter
        )}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
