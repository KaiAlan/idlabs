import type { Metadata, Viewport } from 'next';
import SmoothScroll from '../components/SmoothScroll';
import SiteHeader from '../components/SiteHeader';
import PaperBackdrop from '../components/PaperBackdrop';
import 'lenis/dist/lenis.css';
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
import '@fontsource/inter/latin-600.css';
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
import './manifesto.css';
import './dissection.css';

const title = 'Identity Labs — The world’s first content science lab';
const description = 'Attention compounds. Identity Labs studies the science of virality, the craft of creation, and the ideas that shape the world.';

export const metadata: Metadata = {
  metadataBase: new URL('https://idlabs-hazel.vercel.app'),
  title,
  description,
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'Identity Labs',
    title,
    description,
    images: [{ url: '/og-image.png', width: 1280, height: 800, alt: title }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [{ url: '/og-image.png', alt: title }],
  },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#e6e1d9' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><SmoothScroll /><PaperBackdrop /><SiteHeader />{children}</body></html>;
}
