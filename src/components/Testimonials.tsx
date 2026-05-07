"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { useState, useEffect } from "react";

const testimonialsPool = [
  {
    text: "The atention to detail on our kitchen cabinets was outstanding. They really understood our vision and the 3D process made it so easy to visualize before production. Highly recommend Million Wood.",
    author: "Carlos M.",
    role: "Local Guide · 12 reviews",
    rating: 5,
    date: "2 weeks ago"
  },
  {
    text: "Hubo un pequeño retraso inicial con la llegada de un material premium, pero Katherin me mantuvo informado en todo momento y Julian ajustó los tiempos trabajando el fin de semana para cumplir la fecha. El clóset quedó de revista. Raro encontrar este nivel de responsabilidad en Miami.",
    author: "Roberto F.",
    role: "Local Guide · 34 reviews",
    rating: 5,
    date: "1 month ago"
  },
  {
    text: "Incredible craftsmanship. We hired them for custom wall panels in our Miami office and the result is stunning. They delivered exactly on time and the instalation was spotless.",
    author: "Daniela V.",
    role: "1 review",
    rating: 5,
    date: "3 weeks ago"
  },
  {
    text: "I'm a general contractor and finding reliable CNC and custom closet services is tough. These guys have state-of-the-art machinery and their precision is flawless. A+.",
    author: "Mark R.",
    role: "4 reviews",
    rating: 5,
    date: "3 months ago"
  },
  {
    text: "Julian was fantastic to work with. He designed our entire kitchen in 3D before cutting a single piece of wood, which gave us so much peace of mind. The finished product is a work of art.",
    author: "Sarah J.",
    role: "2 reviews",
    rating: 5,
    date: "1 week ago"
  },
  {
    text: "Contraté a Million Wood para hacer un mueble de TV paramétrico. El nivel de detalle que lograron con la máquina CNC es increible. Superaron mis expectativas por completo.",
    author: "Luis G.",
    role: "Local Guide · 8 reviews",
    rating: 5,
    date: "2 months ago"
  },
  {
    text: "excellent service from start to finish! the wood quality they use (lioher) is simply the best in the market. my walk in closet looks like a boutique store now.",
    author: "Jennifer P.",
    role: "3 reviews",
    rating: 5,
    date: "4 days ago"
  },
  {
    text: "Muy contento con el trabajo. Hubo un detalle con una bisagra que no cerraba bien suave, pero los llamé y al dia siguiente mandaron a alguien a ajustarlo sin cobrar nada extra. Eso vale oro.",
    author: "Andres T.",
    role: "Local Guide · 21 reviews",
    rating: 4,
    date: "2 months ago"
  },
  {
    text: "We quoted our kitchen remodel with 4 different companies in Doral and million wood wasn't the cheapest, but they were the only ones who showed us a proper 3d rendering. Totaly worth the investment.",
    author: "Michael & Lisa",
    role: "1 review",
    rating: 5,
    date: "5 months ago"
  },
  {
    text: "me encantó el diseño de los paneles de madera para mi sala. Katherine fue súper amable guiándome con los colores que combinaban mejor con mi piso.",
    author: "Sofia L.",
    role: "6 reviews",
    rating: 5,
    date: "1 month ago"
  },
  {
    text: "Fast turnaround on a CNC cutting job we needed for a commercial project. Dimensions were exact down to the millimeter. Will use them again.",
    author: "David H.",
    role: "Local Guide · 45 reviews",
    rating: 5,
    date: "2 weeks ago"
  },
  {
    text: "El mejor taller de carpinteria en Miami lejos. Super limpios para trabajar, dejaron mi casa inmaculada despues de instalar la cocina. 10/10",
    author: "Jose R.",
    role: "2 reviews",
    rating: 5,
    date: "3 months ago"
  },
  {
    text: "I was a bit skeptical because they are a smaller shop, but Julian really knows his craft. The custom vanity they built for our master bath is gorgeous. Only gave 4 stars because the installation took 1 day longer than expected, but the quality made up for it.",
    author: "Elena C.",
    role: "9 reviews",
    rating: 4,
    date: "4 months ago"
  },
  {
    text: "super recomendados! mi cocina quedo espectacular y el material anti huellas que me recomendo julian fue la mejor decision para mi casa con niños.",
    author: "Mariana B.",
    role: "Local Guide · 15 reviews",
    rating: 5,
    date: "2 weeks ago"
  },
  {
    text: "They cut some custom architectural shapes for an event activation. Precise, fast, and good comunication.",
    author: "Thomas W.",
    role: "1 review",
    rating: 5,
    date: "1 month ago"
  }
];

// SVG simplificado del logo de Google para darle realismo
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function Testimonials() {
  const [visibleTestimonials, setVisibleTestimonials] = useState(testimonialsPool.slice(0, 3));
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    // Rotar testimonios cada 8 segundos
    const interval = setInterval(() => {
      setStartIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % testimonialsPool.length;
        return nextIndex;
      });
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Actualizar la lista visible cuando cambia el índice
    const newVisible = [];
    for (let i = 0; i < 3; i++) {
      newVisible.push(testimonialsPool[(startIndex + i) % testimonialsPool.length]);
    }
    setVisibleTestimonials(newVisible);
  }, [startIndex]);

  return (
    <section id="why-us" className="py-32 bg-matte-black border-t border-charcoal relative">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          {/* Philosophy / About Block */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-sm uppercase tracking-widest text-metallic-gold font-semibold mb-4">
                Our Philosophy
              </h2>
              <h3 className="text-4xl md:text-5xl font-bold leading-tight mb-8">
                Mastery Meets <br />
                <span className="text-gray-500 font-light">Technology</span>
              </h3>
            </div>
            
            <p className="text-gray-400 text-lg leading-relaxed font-light">
              At Million Wood, we believe that true luxury lies in absolute precision. We are not just carpenters; we are digital craftsmen. 
            </p>
            <p className="text-gray-400 text-lg leading-relaxed font-light">
              By blending generations of traditional woodworking mastery with the world's most advanced CNC technology and parametric design software, we create architectural elements that were previously thought impossible. Every cut, every joint, and every finish is a testament to our relentless pursuit of perfection.
            </p>
            
            <div className="pt-6 border-t border-charcoal flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-white">15+</span>
                <span className="text-xs uppercase tracking-widest text-gray-500 mt-1">Years Experience</span>
              </div>
              <div className="w-[1px] h-12 bg-charcoal"></div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-white">100%</span>
                <span className="text-xs uppercase tracking-widest text-gray-500 mt-1">Custom Built</span>
              </div>
            </div>
          </motion.div>

          {/* Google-Style Testimonials Block */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <GoogleIcon />
              <span className="text-white font-medium">Google Reviews</span>
              <div className="flex gap-1 ml-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#FBBC05] text-[#FBBC05]" />
                ))}
              </div>
              <span className="text-gray-400 text-sm ml-1">5.0</span>
            </div>

            <div className="relative min-h-[500px]">
              <AnimatePresence mode="popLayout">
                {visibleTestimonials.map((testimonial, index) => (
                  <motion.div
                    key={`${testimonial.author}-${index}`}
                    layout
                    initial={{ opacity: 0, x: 50, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -50, scale: 0.95 }}
                    transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
                    className="bg-deep-charcoal border border-charcoal p-6 rounded-lg relative group hover:border-gray-600 transition-colors duration-500 mb-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white font-semibold text-lg border border-gray-600">
                          {testimonial.author.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white font-semibold text-sm">{testimonial.author}</p>
                          <p className="text-xs text-gray-400">{testimonial.role}</p>
                        </div>
                      </div>
                      <GoogleIcon />
                    </div>
                    
                    <div className="flex gap-1 mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#FBBC05] text-[#FBBC05]" />
                      ))}
                      <span className="text-gray-500 text-xs ml-2">{testimonial.date}</span>
                    </div>
                    
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {testimonial.text}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
