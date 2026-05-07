import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Portfolio from "@/components/Portfolio";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Image from "next/image";
import { Facebook, Instagram } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-background selection:bg-metallic-gold selection:text-matte-black">
      {/* Simple Header */}
      <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-matte-black/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center">
            <Image 
              src="/logos/logo png blanco.png" 
              alt="Million Wood" 
              width={220} 
              height={70} 
              className="object-contain h-12 md:h-16 w-auto"
            />
          </div>
          <nav className="hidden md:flex gap-8 text-sm uppercase tracking-widest font-semibold text-gray-400">
            <a href="#services" className="hover:text-metallic-gold transition-colors">Services</a>
            <a href="#process" className="hover:text-metallic-gold transition-colors">Process</a>
            <a href="#portfolio" className="hover:text-metallic-gold transition-colors">Portfolio</a>
            <a href="#why-us" className="hover:text-metallic-gold transition-colors">Why Us</a>
            <a href="#contact" className="hover:text-metallic-gold transition-colors">Contact</a>
          </nav>
          <a href="#contact" className="md:hidden border border-metallic-gold text-metallic-gold px-4 py-2 text-xs uppercase tracking-widest font-semibold">
            Contact
          </a>
        </div>
      </header>

      <Hero />
      <Services />
      <Process />
      <Portfolio />
      <Testimonials />
      <Contact />
      
      {/* Footer with Brand Authority */}
      <footer className="py-12 bg-black border-t border-charcoal text-center text-gray-600 text-sm">
        <div className="container mx-auto px-6 flex flex-col items-center gap-8">
          <Image 
            src="/logos/solo logo blanco.png" 
            alt="Million Wood Icon" 
            width={60} 
            height={60} 
            className="opacity-40 hover:opacity-100 transition-opacity duration-500"
          />
          <div className="flex flex-col md:flex-row justify-between w-full max-w-4xl items-center gap-4">
            <p>&copy; {new Date().getFullYear()} Million Wood. All rights reserved.</p>
            <div className="flex flex-col sm:flex-row gap-6 md:gap-8 items-center mt-4 md:mt-0">
              <a href="https://www.facebook.com/MillionWoodUSA" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-metallic-gold transition-colors group">
                <Facebook className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="font-medium tracking-wide">/MillionWoodUSA</span>
              </a>
              <a href="https://www.instagram.com/millionwoodusa" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-metallic-gold transition-colors group">
                <Instagram className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="font-medium tracking-wide">/millionwoodusa</span>
              </a>
              <a href="https://www.tiktok.com/@millionwoodmia" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-metallic-gold transition-colors group">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 group-hover:scale-110 transition-transform">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
                <span className="font-medium tracking-wide">@millionwoodmia</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
