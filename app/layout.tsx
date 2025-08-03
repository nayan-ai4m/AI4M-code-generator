import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Code Generator - Transform Ideas into Production-Ready Code',
  description: 'Generate high-quality, production-ready code from your ideas using Claude AI, Groq API, and Stackblitz integration. Upload documents, enhance prompts, and preview code in real-time.',
  keywords: 'AI code generator, Claude API, Groq API, Stackblitz, web development, code generation, AI programming assistant',
  authors: [{ name: 'AI Code Generator Team' }],
  openGraph: {
    title: 'AI Code Generator - Transform Ideas into Production-Ready Code',
    description: 'Generate high-quality, production-ready code from your ideas using advanced AI technologies.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Code Generator',
    description: 'Transform your ideas into production-ready code with AI assistance.',
  },
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log('🏗️ RootLayout component initialized');
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {console.log('🏗️ RootLayout body rendering')}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {console.log('🏗️ ThemeProvider initialized')}
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}