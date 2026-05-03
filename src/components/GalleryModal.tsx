"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, LayoutGrid, Palette } from "lucide-react";
import { useEffect, useState } from "react";
import Configurator from "./Configurator";

// Map service IDs to their respective image collections
const galleryData: Record<string, { title: string; images: string[] }> = {
  kitchens: {
    title: "Kitchen Cabinets",
    images: [
      "/services/cocinas/cocina.1.jpg",
      "/services/cocinas/cocina.3.jpg",
      "/services/cocinas/cocina.4.jpg",
      "/services/cocinas/cocina.5.jpg",
      "/services/cocinas/cocina.6.jpg",
      "/services/cocinas/cocina.7.jpg",
      "/services/cocinas/cocina.8.jpg",
      "/services/cocinas/cocinaia1.png",
      "/services/cocinas/cocinaia2.png",
      "/services/cocinas/cocinaia3.png"
    ]
  },
  closets: {
    title: "Custom Closets",
    images: [
      "/services/closets/closet (1).png",
      "/services/closets/closet (2).png",
      "/services/closets/closet (3).png",
      "/services/closets/closet.1.jpg",
      "/services/closets/closet.2.jpg",
      "/services/closets/closet.3.jpg",
      "/services/closets/closet.4.jpg",
      "/services/closets/closet.5.jpg",
      "/services/closets/closet.6.jpg"
    ]
  },
  cnc: {
    title: "CNC Services",
    images: [
      "/services/cnc/CNC CUTTING SERVICE (1).jpeg",
      "/services/cnc/CNC CUTTING SERVICE (4).jpeg",
      "/services/cnc/CNC CUTTING SERVICE (5).jpeg",
      "/services/cnc/CNC CUTTING SERVICE (6).jpeg",
      "/services/cnc/CNC CUTTING SERVICE (7).jpeg"
    ]
  },
  panels: {
    title: "Wall Panels",
    images: [
      "/services/paneles/Wall Panels (1).jpeg",
      "/services/paneles/Wall Panels (2).jpeg",
      "/services/paneles/Wall Panels (3).jpeg"
    ]
  }
};

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceId: string | null;
}

export default function GalleryModal({ isOpen, onClose, serviceId }: GalleryModalProps) {
  const [viewMode, setViewMode] = useState<"gallery" | "studio">("gallery");

  // Prevent scrolling on the body when the modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setViewMode("gallery"); // Reset view mode when opening
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const activeGallery = serviceId ? galleryData[serviceId] : null;

  return (
    <AnimatePresence>
      {isOpen && activeGallery && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[100] flex flex-col bg-matte-black/95 backdrop-blur-xl overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-matte-black/90 backdrop-blur-md border-b border-charcoal">
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-12">
              <motion.h2 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-2xl md:text-3xl font-bold text-white tracking-tight"
              >
                {activeGallery.title} <span className="text-metallic-gold font-light">Experience</span>
              </motion.h2>

              {/* Tabs for Closets only */}
              {serviceId === "closets" && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex bg-charcoal p-1 rounded-md"
                >
                  <button
                    onClick={() => setViewMode("gallery")}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded transition-all duration-300 ${
                      viewMode === "gallery" 
                        ? "bg-matte-black text-white shadow-sm border border-gray-700" 
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" /> Inspiration Gallery
                  </button>
                  <button
                    onClick={() => setViewMode("studio")}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded transition-all duration-300 ${
                      viewMode === "studio" 
                        ? "bg-metallic-gold text-matte-black shadow-[0_0_15px_rgba(212,175,55,0.4)]" 
                        : "text-gray-400 hover:text-metallic-gold"
                    }`}
                  >
                    <Palette className="w-4 h-4" /> Design Studio ✨
                  </button>
                </motion.div>
              )}
            </div>

            <button 
              onClick={onClose}
              className="p-3 bg-deep-charcoal text-white hover:text-metallic-gold rounded-full transition-colors duration-300 border border-charcoal hover:border-metallic-gold"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 w-full">
            {viewMode === "gallery" ? (
              /* Masonry Grid Content */
              <div className="container mx-auto px-6 pb-20 pt-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px] md:auto-rows-[350px]">
                  {activeGallery.images.map((src, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 + index * 0.05, duration: 0.5 }}
                      className={`relative group overflow-hidden bg-charcoal rounded-sm ${
                        index % 5 === 0 ? "md:col-span-2 md:row-span-2" : ""
                      }`}
                    >
                      <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                        style={{ backgroundImage: `url('${src}')` }}
                      />
                      {/* Subtle overlay to enhance contrast */}
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                    </motion.div>
                  ))}
                </div>
                {activeGallery.images.length === 0 && (
                  <div className="text-center text-gray-500 py-20">
                    More images coming soon...
                  </div>
                )}
              </div>
            ) : (
              /* Interactive Studio */
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Configurator onClose={onClose} />
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
