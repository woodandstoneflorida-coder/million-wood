"use client";

import { motion } from "framer-motion";
import { Grid, Box, Columns, Layers, Plus } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import GalleryModal from "./GalleryModal";
import { trackMetaEvent } from "@/lib/metaPixel";

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
                  trackMetaEvent('ViewService', { service_name: service.title }, true);
                }}
                className="group relative bg-deep-charcoal border border-charcoal p-10 overflow-hidden min-h-[320px] transition-all duration-500 hover:border-metallic-gold/50 cursor-pointer"
              >
                {/* Background Image that appears on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-all duration-700 scale-105 group-hover:scale-100">
                  <Image 
                    src={service.image} 
                    alt={service.title} 
                    fill 
                    className="object-cover" 
                    loading="lazy" 
                    quality={75}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-matte-black via-matte-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div className="inline-flex p-4 rounded-full bg-charcoal text-metallic-gold group-hover:bg-metallic-gold group-hover:text-matte-black transition-colors duration-500">
                        <service.icon className="w-8 h-8" />
                      </div>
                      <div className="w-10 h-10 rounded-full border border-gray-600 bg-black/40 backdrop-blur-sm flex items-center justify-center text-gray-400 group-hover:bg-metallic-gold group-hover:text-black group-hover:border-metallic-gold transition-all duration-300 shadow-xl">
                        <Plus className="w-5 h-5" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-semibold mb-4 text-white group-hover:text-gradient-gold transition-all duration-300">
                      {service.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed font-light group-hover:text-gray-200 transition-colors duration-300 max-w-sm">
                      {service.description}
                    </p>
                  </div>
                  <div className="mt-8 pt-6 border-t border-charcoal/50 group-hover:border-metallic-gold/30 flex items-center text-sm font-medium tracking-wider uppercase text-metallic-gold opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transform translate-y-0 lg:translate-y-4 lg:group-hover:translate-y-0 transition-all duration-500">
                    Click to View Gallery &rarr;
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
