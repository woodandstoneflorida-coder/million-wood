import type { Metadata } from "next";
import MainPage from "@/components/MainPage";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const lang = resolvedSearchParams.lang === "es" ? "es" : "en";

  // Google Search Console verification tag from environment variable or placeholder
  const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || "";

  if (lang === "es") {
    return {
      metadataBase: new URL("https://millionwoodusa.com"),
      title: "Million Wood | Clósets a Medida, Cocinas de Lujo y Carpintería en Miami",
      description: "Million Wood fabrica clósets de diseño, vestidores a la medida, gabinetes de cocina premium y corte CNC de alta precisión en Miami, Hollywood y Fort Lauderdale.",
      keywords: [
        "carpintería a medida Miami",
        "clósets a medida Miami",
        "gabinetes de cocina Miami",
        "carpintería de lujo Florida",
        "fábrica de clósets Miami",
        "instalación de cocinas Miami",
        "mecanizado CNC Florida",
        "muebles a la medida Miami",
        "diseño de interiores Miami"
      ],
      alternates: {
        canonical: "https://millionwoodusa.com/?lang=es",
        languages: {
          "en-US": "https://millionwoodusa.com/?lang=en",
          "es-US": "https://millionwoodusa.com/?lang=es",
        },
      },
      openGraph: {
        title: "Million Wood | Clósets a Medida, Cocinas de Lujo y Carpintería en Miami",
        description: "Million Wood fabrica clósets de diseño, vestidores a la medida, gabinetes de cocina premium y corte CNC de alta precisión en Miami, Hollywood y Fort Lauderdale.",
        url: "https://millionwoodusa.com/?lang=es",
        siteName: "Million Wood",
        locale: "es_US",
        type: "website",
        images: [
          {
            url: "/hero/cocina-moderna.png",
            width: 1200,
            height: 630,
            alt: "Million Wood - Carpintería de Lujo en Miami"
          }
        ]
      },
      twitter: {
        card: "summary_large_image",
        title: "Million Wood | Clósets a Medida, Cocinas de Lujo y Carpintería en Miami",
        description: "Million Wood fabrica clósets de diseño, vestidores a la medida, gabinetes de cocina premium y corte CNC de alta precisión en Miami, Hollywood y Fort Lauderdale.",
        images: ["/hero/cocina-moderna.png"]
      },
      verification: googleVerification ? { google: googleVerification } : undefined,
    };
  }

  return {
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
      canonical: "https://millionwoodusa.com/?lang=en",
      languages: {
        "en-US": "https://millionwoodusa.com/?lang=en",
        "es-US": "https://millionwoodusa.com/?lang=es",
      },
    },
    openGraph: {
      title: "Million Wood | Custom Millwork, Closets & Kitchen Cabinets Miami",
      description: "Million Wood provides luxury carpentry, custom walk-in closets, premium kitchen cabinets, and precision CNC fabrication in Miami, Hollywood & Fort Lauderdale.",
      url: "https://millionwoodusa.com/?lang=en",
      siteName: "Million Wood",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: "/hero/cocina-moderna.png",
          width: 1200,
          height: 630,
          alt: "Million Wood - Custom Closets & Kitchen Cabinets Miami"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: "Million Wood | Custom Millwork, Closets & Kitchen Cabinets Miami",
      description: "Million Wood provides luxury carpentry, custom walk-in closets, premium kitchen cabinets, and precision CNC fabrication in Miami, Hollywood & Fort Lauderdale.",
      images: ["/hero/cocina-moderna.png"]
    },
    verification: googleVerification ? { google: googleVerification } : undefined,
  };
}

export default function Home() {
  return <MainPage />;
}
