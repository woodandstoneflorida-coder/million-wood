import type { Metadata } from "next";
import { Outfit, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google';
import Script from 'next/script';
import { Analytics } from "@vercel/analytics/next";
import WhatsAppButton from '@/components/WhatsAppButton';
import UrgencyBanner from '@/components/UrgencyBanner';
import ScratchCardPopup from '@/components/ScratchCardPopup';
import GlobalTracker from '@/components/GlobalTracker';
import SocialProofPopup from '@/components/SocialProofPopup';
import { LanguageProvider } from '@/lib/LanguageContext';
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
  title: "Million Wood | Custom Millwork, Closets & Kitchen Cabinets Miami",
  description: "Million Wood provides luxury carpentry, custom walk-in closets, premium kitchen cabinets, and precision CNC fabrication in Miami, Hollywood & Fort Lauderdale.",
  keywords: [
    "custom millwork Miami",
    "custom closets Miami",
    "custom kitchen cabinets Miami",
    "luxury carpentry South Florida",
    "fábrica de clósets Miami",
    "instalación de cocinas Miami",
    "closet maker Hollywood FL",
    "CNC fabrication Florida",
    "custom woodworking Fort Lauderdale"
  ],
  alternates: {
    canonical: "https://millionwoodusa.com",
    languages: {
      "en-US": "https://millionwoodusa.com/?lang=en",
      "es-US": "https://millionwoodusa.com/?lang=es",
    },
  },
  openGraph: {
    title: "Million Wood | Custom Millwork, Closets & Kitchen Cabinets Miami",
    description: "Million Wood provides luxury carpentry, custom walk-in closets, premium kitchen cabinets, and precision CNC fabrication in Miami, Hollywood & Fort Lauderdale.",
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
        {/* Structured Data for Local SEO (Google Knowledge Graph & Maps) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CabinetMaker",
              "name": "Million Wood",
              "image": "https://millionwoodusa.com/logos/logo%20png%20blanco.png",
              "@id": "https://millionwoodusa.com/#localbusiness",
              "url": "https://millionwoodusa.com",
              "telephone": "+1-754-267-3047",
              "priceRange": "$$$",
              "description": "Million Wood provides custom millwork, luxury walk-in closets, bespoke kitchen cabinets, and precise industrial CNC fabrication services in Miami, Hollywood, Doral & Fort Lauderdale. / Million Wood ofrece carpintería de autor, clósets de diseño, gabinetes de cocina de lujo y corte CNC en el sur de la Florida.",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "7321 NW 61ST STREET",
                "addressLocality": "Miami",
                "addressRegion": "FL",
                "postalCode": "33166",
                "addressCountry": "US"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 25.8302,
                "longitude": -80.3156
              },
              "areaServed": [
                {
                  "@type": "AdministrativeArea",
                  "name": "Miami"
                },
                {
                  "@type": "AdministrativeArea",
                  "name": "Hollywood"
                },
                {
                  "@type": "AdministrativeArea",
                  "name": "Fort Lauderdale"
                },
                {
                  "@type": "AdministrativeArea",
                  "name": "Hialeah"
                },
                {
                  "@type": "AdministrativeArea",
                  "name": "Doral"
                },
                {
                  "@type": "AdministrativeArea",
                  "name": "Medley"
                },
                {
                  "@type": "AdministrativeArea",
                  "name": "South Florida"
                }
              ],
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Million Wood Services Catalog",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Custom Kitchen Cabinets / Gabinetes de Cocina a Medida",
                      "description": "Bespoke high-end kitchen cabinetry and design combining flawless aesthetics with intelligent storage solutions."
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Custom Closets & Walk-In Closets / Clósets y Vestidores de Diseño",
                      "description": "Luxurious, tailor-made closets engineered for perfect organization and premium finish."
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Industrial CNC Routing & Machining / Mecanizado y Ruteado CNC",
                      "description": "High-precision CNC cutting, custom routing, and drilling for architectural wood projects using state-of-the-art industrial machinery."
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Architectural Wall Panels / Paneles de Pared Decorativos",
                      "description": "Custom wood paneling, geometric accent walls, and elegant decorative partitions."
                    }
                  }
                ]
              },
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday"
                ],
                "opens": "08:00",
                "closes": "18:00"
              },
              "sameAs": [
                "https://www.facebook.com/MillionWoodUSA",
                "https://www.instagram.com/millionwoodusa",
                "https://www.tiktok.com/@millionwoodmia"
              ]
            })
          }}
        />

        <LanguageProvider>
          <GlobalTracker />
          <UrgencyBanner />
          {children}
          <ScratchCardPopup />
          <SocialProofPopup />
          <WhatsAppButton />
        </LanguageProvider>

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
        <Analytics />
      </body>
    </html>
  );
}
