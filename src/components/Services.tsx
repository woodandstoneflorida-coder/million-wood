"use client";

import { motion } from "framer-motion";
import { Grid, Box, Columns, Layers } from "lucide-react";
import { useState } from "react";
import GalleryModal from "./GalleryModal";

const services = [
  {
    id: "kitchens",
    title: "Kitchen Cabinets",
    description: "Bespoke kitchen cabinetry combining flawless aesthetics with intelligent storage solutions.",
    icon: Grid,
    image: "/services/cocinas/cocina.1.jpg",
  },
  {
    id: "closets",
    title: "Custom Closets",
    description: "Luxurious, tailor-made closets engineered for perfect organization and premium finish.",
    icon: Box,
    image: "/services/closets/closet (1).png",
  },
  {
    id: "cnc",
    title: "CNC Services",
    description: "High-precision cutting, routing, and drilling using state-of-the-art industrial machinery.",
    icon: Layers,
    image: "/services/cnc/CNC CUTTING SERVICE (1).jpeg",
  },
  {
    id: "panels",
    title: "Wall Panels",
    description: "Architectural wall panels with intricate geometric patterns or seamless, elegant finishes.",
    icon: Columns,
    image: "/services/paneles/Wall Panels (3).jpeg",
  },
];

export default function Services() {
  const [activeServiceId, setActiveServiceId] = useState<string | null>(null);

  return (
    <>
      <section id="services" className="py-32 bg-matte-black relative">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col items-center mb-20 text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold mb-6 tracking-tight"
            >
              Uncompromising <span className="text-gradient-bronze">Craftsmanship</span>
            </motion.h2>
            <div className="w-24 h-[1px] bg-metallic-gold opacity-50 mb-6"></div>
            <p className="text-gray-400 max-w-2xl text-lg font-light">
              Every piece is meticulously crafted to perfection. We blend traditional woodworking mastery with advanced technological precision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                onClick={() => {
                  setActiveServiceId(service.id);
                  if (typeof window !== "undefined" && (window as any).fbq) {
                    (window as any).fbq('trackCustom', 'ViewService', { service_name: service.title });
                  }
                }}
                className="group relative bg-deep-charcoal border border-charcoal p-10 overflow-hidden min-h-[320px] transition-all duration-500 hover:border-metallic-gold/50 cursor-pointer"
              >
                {/* Background Image that appears on hover */}
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-0 group-hover:opacity-40 transition-all duration-700 scale-105 group-hover:scale-100"
                  style={{ backgroundImage: `url('${service.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-matte-black via-matte-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className="mb-6 inline-flex p-4 rounded-full bg-charcoal text-metallic-gold group-hover:bg-metallic-gold group-hover:text-matte-black transition-colors duration-500">
                      <service.icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-4 text-white group-hover:text-gradient-gold transition-all duration-300">
                      {service.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed font-light group-hover:text-gray-200 transition-colors duration-300 max-w-sm">
                      {service.description}
                    </p>
                  </div>
                  <div className="mt-8 pt-6 border-t border-charcoal/50 group-hover:border-metallic-gold/30 flex items-center text-sm font-medium tracking-wider uppercase text-metallic-gold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    Discover More &rarr;
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <GalleryModal 
        isOpen={!!activeServiceId} 
        onClose={() => setActiveServiceId(null)} 
        serviceId={activeServiceId} 
      />
    </>
  );
}
