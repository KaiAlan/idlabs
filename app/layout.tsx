import type { Metadata, Viewport } from 'next';
import '@fontsource/instrument-serif/latin-400.css';
import '@fontsource/instrument-serif/latin-400-italic.css';
import '@fontsource/imperial-script/latin-400.css';
import '@fontsource/ibm-plex-mono/latin-400.css';
import '@fontsource/ibm-plex-mono/latin-500.css';
import '@fontsource/ibm-plex-mono/latin-700.css';
import '@fontsource/ibm-plex-mono/latin-400-italic.css';
import '@fontsource/ibm-plex-mono/latin-500-italic.css';
import '@fontsource-variable/source-serif-4/standard.css';
import '@fontsource-variable/source-serif-4/standard-italic.css';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-700.css';
import '@fontsource/dm-mono/latin-400.css';
import '@fontsource/dm-mono/latin-500.css';
import '@fontsource/dm-mono/latin-400-italic.css';
import '@fontsource/space-mono/latin-400.css';
import '@fontsource/space-mono/latin-700.css';
import '@fontsource/playfair-display/latin-500-italic.css';
import './globals.css';
import './design.css';
import './refinements.css';

export const metadata: Metadata = {
  title: 'Identity Labs — The world’s first content science lab',
  description: 'Attention compounds. Identity Labs studies the science of virality, the craft of creation, and the ideas that shape the world.',
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#e6e1d9' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
