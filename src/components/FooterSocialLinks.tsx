"use client";

import { Facebook, Instagram } from "lucide-react";
import { trackMetaEvent } from "@/lib/metaPixel";

export default function FooterSocialLinks() {
  const handleSocialClick = (platform: string) => {
    trackMetaEvent('Contact', { method: platform, type: 'SocialOutbound' }, true);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-6 md:gap-8 items-center mt-4 md:mt-0">
      <a 
        href="https://www.facebook.com/MillionWoodUSA" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="flex items-center gap-2 hover:text-metallic-gold transition-colors group"
        onClick={() => handleSocialClick('Facebook')}
      >
        <Facebook className="w-4 h-4 group-hover:scale-110 transition-transform" />
        <span className="font-medium tracking-wide">/MillionWoodUSA</span>
      </a>
      <a 
        href="https://www.instagram.com/millionwoodusa" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="flex items-center gap-2 hover:text-metallic-gold transition-colors group"
        onClick={() => handleSocialClick('Instagram')}
      >
        <Instagram className="w-4 h-4 group-hover:scale-110 transition-transform" />
        <span className="font-medium tracking-wide">/millionwoodusa</span>
      </a>
      <a 
        href="https://www.tiktok.com/@millionwoodmia" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="flex items-center gap-2 hover:text-metallic-gold transition-colors group"
        onClick={() => handleSocialClick('TikTok')}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 group-hover:scale-110 transition-transform">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
        </svg>
        <span className="font-medium tracking-wide">@millionwoodmia</span>
      </a>
    </div>
  );
}
