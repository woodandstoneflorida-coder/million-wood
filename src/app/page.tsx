import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Portfolio from "@/components/Portfolio";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Image from "next/image";
import FooterSocialLinks from "@/components/FooterSocialLinks";

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
          <nav className="hidden md:flex items-center gap-8 text-sm uppercase tracking-widest font-semibold text-gray-400">
            <a href="#services" className="hover:text-metallic-gold transition-colors">Services</a>
            <a href="#process" className="hover:text-metallic-gold transition-colors">Process</a>
            <a href="#portfolio" className="hover:text-metallic-gold transition-colors">Portfolio</a>
            <a href="#why-us" className="hover:text-metallic-gold transition-colors">Why Us</a>
            <a href="https://wa.me/17542673047?text=Hello!%20I'm%20interested%20in%20starting%20a%20custom%20woodworking%20project%20with%20Million%20Wood." target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-[#25D366] text-white px-5 py-2 rounded-full hover:bg-[#1DA851] transition-all hover:scale-105 shadow-[0_0_15px_rgba(37,211,102,0.3)]">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp
            </a>
          </nav>
          <a href="https://wa.me/17542673047?text=Hello!%20I'm%20interested%20in%20starting%20a%20custom%20woodworking%20project%20with%20Million%20Wood." target="_blank" rel="noopener noreferrer" className="md:hidden flex items-center gap-1.5 bg-[#25D366] text-white px-4 py-2 text-xs uppercase tracking-widest font-semibold rounded-full hover:bg-[#1DA851] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            WhatsApp
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
            <FooterSocialLinks />
          </div>
        </div>
      </footer>
    </main>
  );
}
