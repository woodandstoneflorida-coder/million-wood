import type { Metadata } from "next";
import { Outfit, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google';
import Script from 'next/script';
import WhatsAppButton from '@/components/WhatsAppButton';
import UrgencyBanner from '@/components/UrgencyBanner';
import ScratchCardPopup from '@/components/ScratchCardPopup';
import GlobalTracker from '@/components/GlobalTracker';
import SocialProofPopup from '@/components/SocialProofPopup';
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://millionwoodusa.com"),
  title: "Million Wood | High-End Carpentry & CNC Fabrication",
  description: "Million Wood provides luxury carpentry, custom cabinets, and precision CNC fabrication services, merging 3D design with master craftsmanship.",
  openGraph: {
    title: "Million Wood | High-End Carpentry & CNC Fabrication",
    description: "Million Wood provides luxury carpentry, custom cabinets, and precision CNC fabrication services, merging 3D design with master craftsmanship.",
    url: "https://millionwoodusa.com",
    siteName: "Million Wood",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground overflow-x-hidden">
        <GlobalTracker />
        <UrgencyBanner />
        {children}
        <ScratchCardPopup />
        <SocialProofPopup />
        <WhatsAppButton />

        {/* Google Analytics (Tag Manager) */}
        {process.env.NEXT_PUBLIC_GOOGLE_ID && process.env.NEXT_PUBLIC_GOOGLE_ID !== 'TU_ID_AQUI' && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ID} />
        )}

        {/* Facebook Pixel */}
        {process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID && process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID !== 'TU_ID_AQUI' && (
          <>
            <Script
              id="fb-pixel"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  !function(f,b,e,v,n,t,s)
                  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s)}(window, document,'script',
                  'https://connect.facebook.net/en_US/fbevents.js');
                  fbq('init', '${process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID}');
                `,
              }}
            />
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: 'none' }}
                src={`https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID}&ev=PageView&noscript=1`}
                alt=""
              />
            </noscript>
          </>
        )}
      </body>
    </html>
  );
}
