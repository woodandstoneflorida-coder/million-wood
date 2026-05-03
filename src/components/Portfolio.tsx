"use client";

import { motion } from "framer-motion";
import Image from "next/image";

// We select a mix of the uploaded images to show in the gallery
const portfolioItems = [
  { src: "/services/cocinas/cocina.1.jpg", alt: "Modern Custom Kitchen" },
  { src: "/services/cocinas/cocina.3.jpg", alt: "Luxury Wood Cabinetry" },
  { src: "/services/cocinas/cocina.4.jpg", alt: "Premium Finishes" },
  { src: "/services/cocinas/cocina.5.jpg", alt: "High-End Design" },
  { src: "/services/cocinas/cocina.7.jpg", alt: "Precision Installation" },
  { src: "/services/cocinas/cocina.8.jpg", alt: "Custom Carpentry" },
];

export default function Portfolio() {
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
            Our <span className="text-gradient-gold">Portfolio</span>
          </motion.h2>
          <div className="w-24 h-[1px] bg-metallic-gold opacity-50 mb-6"></div>
          <p className="text-gray-400 max-w-2xl text-lg font-light">
            A selection of our finest completed projects, showcasing the intersection of master carpentry and modern design.
          </p>
        </div>

        {/* CSS Grid for a masonry-like look */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[300px]">
          {portfolioItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className={`relative group overflow-hidden bg-matte-black ${
                index === 0 ? "md:col-span-2 md:row-span-2" : ""
              } ${index === 3 ? "lg:col-span-2" : ""}`}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                style={{ backgroundImage: `url('${item.src}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-matte-black/90 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <div className="text-metallic-gold text-sm font-semibold tracking-wider uppercase mb-1">Project</div>
                <h3 className="text-white text-xl font-medium">{item.alt}</h3>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <a
            href="#contact"
            className="inline-flex items-center justify-center px-8 py-4 text-white uppercase tracking-wider text-sm font-semibold border border-charcoal hover:border-metallic-gold hover:text-metallic-gold transition-colors duration-300"
          >
            Start Your Own Project
          </a>
        </div>
      </div>
    </section>
  );
}
