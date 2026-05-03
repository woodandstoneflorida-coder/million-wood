"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image and gradients */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity"
          style={{ backgroundImage: "url('/hero/cocina-moderna.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-matte-black via-matte-black/80 to-matte-black/40" />
      </div>

      <div className="container relative z-10 mx-auto px-6 text-center mt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-metallic-bronze tracking-widest uppercase text-sm font-semibold mb-6">
            Precision • Quality • Mastery
          </h2>
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight tracking-tight">
            Elevating Spaces with <br />
            <span className="text-gradient-gold">Master Carpentry</span>
          </h1>
          <p className="text-light-gray text-lg md:text-xl mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            High-end carpentry and advanced CNC fabrication tailored to create luxurious, custom environments with absolute precision.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <a
              href="#contact"
              className="group relative inline-flex items-center justify-center px-8 py-4 bg-metallic-gold text-matte-black font-semibold uppercase tracking-wider text-sm overflow-hidden transition-all hover:bg-white"
            >
              <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
              <span className="relative flex items-center gap-2">
                Start a Project <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            </a>
            
            <a
              href="#services"
              className="px-8 py-4 text-white uppercase tracking-wider text-sm font-semibold border border-charcoal hover:border-metallic-gold transition-colors duration-300"
            >
              Explore Services
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs uppercase tracking-widest text-gray-500">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-gray-500 to-transparent" />
      </motion.div>
    </section>
  );
}
