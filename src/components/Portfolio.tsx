"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { trackMetaEvent } from "@/lib/metaPixel";
import { useLanguage } from "@/lib/LanguageContext";

// We select a mix of the uploaded images to show in the gallery
const portfolioItems = [
  { src: "/services/closets/closet (1).png", altKey: "portfolio.items.closet1" },
  { src: "/services/cocinas/cocina.1.jpg", altKey: "portfolio.items.kitchen" },
  { src: "/services/paneles/seccion servicios wall panel/wall panel 3.jpg", altKey: "portfolio.items.wallPanel3" },
  { src: "/services/closets/closet.3.jpg", altKey: "portfolio.items.closet2" },
  { src: "/services/paneles/seccion servicios wall panel/wall panel1.jpg", altKey: "portfolio.items.wallPanel1" },
  { src: "/services/cocinas/cocina.3.jpg", altKey: "portfolio.items.cabinets" },
];

export default function Portfolio() {
  const { t } = useLanguage();

  return (
    <section id="portfolio" className="py-32 bg-deep-charcoal border-t border-charcoal relative">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col items-center mb-16 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6 tracking-tight"
          >
            {t("portfolio.title1")} <span className="text-gradient-gold">{t("portfolio.title2")}</span>
          </motion.h2>
          <div className="w-24 h-[1px] bg-metallic-gold opacity-50 mb-6"></div>
          <p className="text-gray-400 max-w-2xl text-lg font-light">
            {t("portfolio.description")}
          </p>
        </div>

        {/* CSS Grid for a masonry-like look */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[300px]">
          {portfolioItems.map((item, index) => {
            const altText = t(item.altKey);

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className={`relative group overflow-hidden bg-matte-black ${
                  index === 0 ? "md:col-span-2 md:row-span-2" : ""
                } ${index === 3 ? "lg:col-span-2" : ""}`}
                onMouseEnter={() => {
                  trackMetaEvent('ViewPortfolio', { project: altText }, true);
                }}
              >
                <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100">
                  <Image
                    src={item.src}
                    alt={altText}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    loading="lazy"
                    quality={75}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-matte-black/90 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
                
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="text-metallic-gold text-sm font-semibold tracking-wider uppercase mb-1">
                    {t("portfolio.title2")}
                  </div>
                  <h3 className="text-white text-xl font-medium">{altText}</h3>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        <div className="mt-16 text-center">
          <a
            href="#contact"
            className="inline-flex items-center justify-center px-8 py-4 text-white uppercase tracking-wider text-sm font-semibold border border-charcoal hover:border-metallic-gold hover:text-metallic-gold transition-colors duration-300"
          >
            {t("portfolio.cta")}
          </a>
        </div>
      </div>
    </section>
  );
}
