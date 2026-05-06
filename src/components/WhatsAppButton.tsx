"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { trackMetaEvent } from "@/lib/metaPixel";

export default function WhatsAppButton() {
  // Replace this with the actual phone number, including country code (e.g., 1234567890)
  const phoneNumber = "17542673047";
  const message = "Hello! I'm interested in starting a custom woodworking project with Million Wood.";
  
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  const handleClick = () => {
    trackMetaEvent('Contact', { method: 'WhatsApp' }, true);
  };

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, type: "spring", stiffness: 200, damping: 20 }}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-[0_4px_14px_0_rgba(37,211,102,0.39)] hover:shadow-[0_6px_20px_rgba(37,211,102,0.23)] hover:bg-[#1DA851] hover:-translate-y-1 transition-all duration-300"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
      
      {/* Pulse effect ring */}
      <span className="absolute w-full h-full rounded-full border-2 border-[#25D366] animate-ping opacity-75"></span>
    </motion.a>
  );
}
