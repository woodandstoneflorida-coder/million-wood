"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";

const NAMES = ["Carlos", "Maria", "John", "Sarah", "David", "Elena", "Michael", "Laura", "Roberto", "Jessica"];
const LOCATIONS = [
  "Miami", "Brickell", "Coral Gables", "Doral", "Weston", 
  "Pinecrest", "Aventura", "Fort Lauderdale", "Boca Raton", "West Palm Beach"
];
const ACTIONS = [
  "acaba de solicitar una cotización",
  "reservó una asesoría 3D",
  "desbloqueó un Golden Ticket",
  "inició el diseño de su clóset",
  "cotizó un proyecto CNC"
];

export default function SocialProofPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [notification, setNotification] = useState({ name: "", location: "", action: "", timeAgo: "" });

  useEffect(() => {
    // No mostrar inmediatamente al cargar la página
    let isMounted = true;
    
    const showRandomNotification = () => {
      if (!isMounted) return;
      
      const name = NAMES[Math.floor(Math.random() * NAMES.length)];
      const location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
      const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
      const time = Math.floor(Math.random() * 15) + 1; // 1 to 15 mins ago

      setNotification({ name, location, action, timeAgo: `Hace ${time} min` });
      setIsVisible(true);

      // Hide after 5 seconds
      setTimeout(() => {
        if (isMounted) setIsVisible(false);
      }, 5000);
    };

    // Show first notification after 15 seconds
    const initialTimer = setTimeout(() => {
      showRandomNotification();
      
      // Then show a new one every 25-40 seconds
      const interval = setInterval(() => {
        showRandomNotification();
      }, Math.floor(Math.random() * 15000) + 25000);
      
      return () => clearInterval(interval);
    }, 15000);

    return () => {
      isMounted = false;
      clearTimeout(initialTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: -20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}
          className="fixed bottom-24 left-4 md:bottom-8 md:left-8 z-[60] bg-matte-black/95 border border-metallic-gold/30 p-4 rounded-lg shadow-[0_8px_30px_rgba(0,0,0,0.5)] flex items-start gap-3 max-w-[300px] backdrop-blur-sm"
        >
          <div className="mt-1 flex-shrink-0">
            <CheckCircle2 className="w-5 h-5 text-metallic-gold" />
          </div>
          <div className="flex-1 pr-4">
            <p className="text-white text-sm font-medium">
              {notification.name} en <span className="text-metallic-gold">{notification.location}</span>
            </p>
            <p className="text-gray-400 text-xs mt-0.5 leading-snug">
              {notification.action}
            </p>
            <p className="text-gray-500 text-[10px] mt-1.5 uppercase tracking-wider">
              {notification.timeAgo}
            </p>
          </div>
          <button 
            onClick={() => setIsVisible(false)}
            className="absolute top-2 right-2 text-gray-500 hover:text-white transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
