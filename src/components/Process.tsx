"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const steps = [
  {
    number: "01",
    title: "3D Parametric Design",
    description: "We utilize Mozaik software for precise cabinet engineering, ensuring perfect fit and functionality before a single board is cut.",
    tech: "Mozaik 3D"
  },
  {
    number: "02",
    title: "Complex Geometry",
    description: "For custom organic shapes and intricate panels, we model using Rhino and Grasshopper, pushing the boundaries of traditional woodwork.",
    tech: "Rhino / Grasshopper"
  },
  {
    number: "03",
    title: "Industrial CNC Machining",
    description: "Our high-end industrial CNC routers execute the digital models with fraction-of-a-millimeter accuracy, minimizing waste and maximizing quality.",
    tech: "Precision CNC"
  },
  {
    number: "04",
    title: "Masterful Installation",
    description: "The final pieces are assembled and installed by master carpenters, bringing the virtual perfection into the physical world.",
    tech: "Expert Craftsmanship"
  }
];

export default function Process() {
  return (
    <section id="process" className="py-32 bg-deep-charcoal border-y border-charcoal relative overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0 opacity-20 mix-blend-luminosity">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/services/paneles/closet%20bruno.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-deep-charcoal via-transparent to-deep-charcoal" />
      </div>

      {/* Background line accent */}
      <div className="absolute top-0 bottom-0 left-1/2 md:left-1/4 w-[1px] bg-charcoal hidden md:block z-0"></div>

      {/* Brand Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none opacity-[0.03]">
        <Image 
          src="/logos/solo logo blanco.png" 
          alt="Million Wood Watermark" 
          width={800} 
          height={800} 
          className="w-full max-w-[800px] h-auto object-contain"
        />
      </div>
      
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="mb-24 md:ml-1/4 md:pl-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Our Tech-Driven <br/><span className="text-gradient-gold">Process</span>
          </motion.h2>
          <p className="text-gray-400 max-w-xl text-lg font-light leading-relaxed">
            What sets us apart is our seamless integration of advanced software and heavy industrial machinery, ensuring unparalleled precision.
          </p>
        </div>

        <div className="space-y-20">
          {steps.map((step, index) => (
            <div key={index} className="relative flex flex-col md:flex-row items-start md:items-center">
              
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="hidden md:flex w-1/4 justify-end pr-16"
              >
                <span className="text-6xl font-bold text-charcoal tracking-tighter">
                  {step.number}
                </span>
              </motion.div>
              
              <div className="absolute left-0 md:left-1/4 w-4 h-4 bg-matte-black border-2 border-metallic-gold rounded-full transform -translate-x-1/2 mt-2 md:mt-0 shadow-[0_0_15px_rgba(212,175,55,0.4)] hidden md:block"></div>

              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="md:w-3/4 md:pl-16 bg-matte-black/50 p-8 md:p-12 border border-charcoal hover:border-metallic-gold/30 transition-colors duration-300 w-full backdrop-blur-sm"
              >
                <div className="flex items-center gap-4 mb-4">
                  <span className="md:hidden text-3xl font-bold text-metallic-gold">{step.number}.</span>
                  <h3 className="text-2xl md:text-3xl font-semibold text-white">{step.title}</h3>
                </div>
                <p className="text-gray-400 text-lg mb-6 leading-relaxed font-light">
                  {step.description}
                </p>
                <div className="inline-block px-4 py-2 bg-charcoal/50 text-metallic-bronze text-sm font-medium tracking-widest uppercase border border-charcoal">
                  {step.tech}
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
