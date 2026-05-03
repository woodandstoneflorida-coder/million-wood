"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";

export default function ScratchCardPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [discountLevel, setDiscountLevel] = useState<"10" | "5">("10");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const scratchCount = useRef(0);

  useEffect(() => {
    const existingCode = localStorage.getItem("mw_discount_code");
    const dismissed = localStorage.getItem("mw_scratch_dismissed");
    const blacklisted = localStorage.getItem("mw_discount_blacklisted");
    const expiredOnce = localStorage.getItem("mw_discount_expired_once");
    
    if (blacklisted) return; // Do not show anything if blacklisted

    if (expiredOnce) {
      setDiscountLevel("5");
    }
    
    if (!existingCode && !dismissed) {
      
      // 1. Desktop Exit Intent (Mouse moving up)
      const handleMouseOut = (e: MouseEvent) => {
        if (e.clientY <= 5) {
          triggerPopup();
        }
      };

      // 2. Mobile Exit Intent (Fast scroll up or scrolling far down)
      let lastScrollY = window.scrollY;
      const handleScroll = () => {
        const currentScrollY = window.scrollY;
        
        // Only apply mobile logic if it's a touch device or small screen
        if (window.innerWidth < 1024) {
          // If they scroll up very fast (intent to go to address bar)
          if (lastScrollY - currentScrollY > 50) {
            triggerPopup();
          }
          
          // Or if they reach 70% of the page (high interest)
          const scrollPercentage = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
          if (scrollPercentage > 0.7) {
            triggerPopup();
          }
        }
        lastScrollY = currentScrollY;
      };

      const triggerPopup = () => {
        setIsOpen(true);
        document.removeEventListener("mouseout", handleMouseOut);
        window.removeEventListener("scroll", handleScroll);
      };

      document.addEventListener("mouseout", handleMouseOut);
      window.addEventListener("scroll", handleScroll, { passive: true });
      
      return () => {
        document.removeEventListener("mouseout", handleMouseOut);
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  useEffect(() => {
    if (isOpen && !isRevealed && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Ensure canvas matches its display size
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }

      // Draw the "scratchable" layer (gold gradient)
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, "#C59B27"); // metallic gold
      gradient.addColorStop(0.5, "#E8C86A"); // lighter gold
      gradient.addColorStop(1, "#916B0D"); // dark gold

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add "Scratch Here" text
      ctx.font = "bold 20px Inter, sans-serif";
      ctx.fillStyle = "rgba(0,0,0,0.4)";
      ctx.textAlign = "center";
      ctx.fillText("SCRATCH TO REVEAL", canvas.width / 2, canvas.height / 2);
    }
  }, [isOpen, isRevealed]);

  const scratch = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current || isRevealed) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2);
    ctx.fill();

    scratchCount.current += 1;

    // Auto-reveal after a bit of scratching (approx 40 moves)
    if (scratchCount.current > 40) {
      handleReveal();
    }
  };

  const handleReveal = () => {
    setIsRevealed(true);
    // Generate a unique code
    const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
    const newCode = `MW-${randomChars}`;
    setDiscountCode(newCode);

    const hours = discountLevel === "10" ? 2 : 4;
    const expiresAt = Date.now() + hours * 60 * 60 * 1000;
    
    localStorage.setItem("mw_discount_code", newCode);
    localStorage.setItem("mw_discount_expires", expiresAt.toString());
    localStorage.setItem("mw_discount_level", discountLevel);
    
    // Dispatch custom event to tell the UrgencyBanner to show up
    window.dispatchEvent(new Event('mw_code_generated'));
  };

  const closePopup = () => {
    setIsOpen(false);
    if (!isRevealed) {
      localStorage.setItem("mw_scratch_dismissed", "true");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[45] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 pt-24"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-deep-charcoal border border-metallic-gold shadow-[0_0_50px_rgba(212,175,55,0.15)] max-w-md w-full relative overflow-hidden"
          >
            {/* Close Button */}
            <button 
              onClick={closePopup}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8 text-center flex flex-col items-center">
              <Sparkles className="w-8 h-8 text-metallic-gold mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-widest">
                Exclusive <span className="text-metallic-gold">Privilege</span>
              </h2>
              {discountLevel === "10" ? (
                <p className="text-gray-400 text-sm font-light mb-4">
                  You found 1 of the 10 Golden Tickets available today! Unlock an additional <strong className="text-metallic-gold font-semibold">10% discount</strong> on your custom woodwork quote.
                </p>
              ) : (
                <p className="text-gray-400 text-sm font-light mb-4">
                  We noticed you let your previous code expire. As a final courtesy, here is a <strong className="text-metallic-gold font-semibold">5% discount</strong> valid for 4 hours.
                </p>
              )}

              {/* Scratch Area */}
              <div className="relative w-full h-36 bg-matte-black border border-gray-700 flex items-center justify-center overflow-hidden">
                {/* The Secret Revealed Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-2 opacity-100">
                  <span className="text-[10px] text-metallic-gold uppercase tracking-widest mb-1">Your Unique Code</span>
                  <span className="text-3xl font-mono font-bold text-white tracking-widest">{discountCode || "MW-XXXX"}</span>
                  <span className="text-[10px] text-gray-400 mt-2 px-4 leading-tight">
                    Contact us within <strong className="text-white">{discountLevel === "10" ? "2" : "4"} hours</strong> to freeze this code. Once frozen, it remains valid for 7 days.
                  </span>
                </div>

                {/* The Scratchable Canvas */}
                <AnimatePresence>
                  {!isRevealed && (
                    <motion.canvas
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1 }}
                      ref={canvasRef}
                      className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
                      onMouseDown={() => (isDrawing.current = true)}
                      onMouseUp={() => (isDrawing.current = false)}
                      onMouseLeave={() => (isDrawing.current = false)}
                      onMouseMove={scratch}
                      onTouchStart={() => (isDrawing.current = true)}
                      onTouchEnd={() => (isDrawing.current = false)}
                      onTouchMove={scratch}
                    />
                  )}
                </AnimatePresence>
              </div>

              {isRevealed && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 w-full flex flex-col gap-3"
                >
                  <a 
                    href={`https://wa.me/17542673047?text=Hi!%20I%20want%20to%20freeze%20my%20Golden%20Ticket%20discount%20code:%20${discountCode}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={closePopup}
                    className="w-full px-6 py-3 bg-[#25D366] text-white font-bold uppercase tracking-widest text-xs hover:bg-[#128C7E] transition-colors shadow-[0_0_15px_rgba(37,211,102,0.3)] flex items-center justify-center gap-2"
                  >
                    Freeze via WhatsApp
                  </a>
                  
                  <button
                    onClick={() => {
                      closePopup();
                      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="w-full px-6 py-3 bg-charcoal border border-metallic-gold text-metallic-gold font-bold uppercase tracking-widest text-xs hover:bg-metallic-gold hover:text-matte-black transition-colors"
                  >
                    Freeze via Email Form
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
