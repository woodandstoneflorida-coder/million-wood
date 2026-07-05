import type { Metadata } from "next";
import { Outfit, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
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
              "description": "Million Wood provides custom millwork, luxury walk-in closets, bespoke kitchen cabinets, and precise industrial CNC fabrication services in Miami, Hollywood, Doral & Fort Lauderdale.",
              "address": [
                {
                  "@type": "PostalAddress",
                  "streetAddress": "7321 NW 61ST STREET",
                  "addressLocality": "Miami",
                  "addressRegion": "FL",
                  "postalCode": "33166",
                  "addressCountry": "US"
                },
                {
                  "@type": "PostalAddress",
                  "streetAddress": "5161 NW 79TH AVE #1037 UNIT 5",
                  "addressLocality": "Doral",
                  "addressRegion": "FL",
                  "postalCode": "33166",
                  "addressCountry": "US"
                }
              ],
              "geo": [
                {
                  "@type": "GeoCoordinates",
                  "latitude": 25.8302,
                  "longitude": -80.3156
                },
                {
                  "@type": "GeoCoordinates",
                  "latitude": 25.8201,
                  "longitude": -80.3225
                }
              ],
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
                  "name": "Doral"
                },
                {
                  "@type": "AdministrativeArea",
                  "name": "South Florida"
                }
              ]
            })
          }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
