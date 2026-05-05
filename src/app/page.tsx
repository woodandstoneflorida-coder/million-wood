import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Portfolio from "@/components/Portfolio";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Image from "next/image";

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
            <div className="flex gap-4">
              <a href="#" className="hover:text-metallic-gold transition-colors">Instagram</a>
              <a href="#" className="hover:text-metallic-gold transition-colors">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
