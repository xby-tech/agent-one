import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AGENT_ONE: Agentic Commerce Simulator',
  description:
    'You are an AI agent. Complete the transaction. An interactive simulator exploring how AI agents will navigate payments.',
  openGraph: {
    title: 'AGENT_ONE: Agentic Commerce Simulator',
    description:
      'You are an AI agent. Complete the transaction. An interactive simulator exploring how AI agents will navigate payments.',
    images: ['/og-image.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
