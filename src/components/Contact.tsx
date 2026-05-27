"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, Sparkles, ShieldCheck, Gem } from "lucide-react";
import { useState, useEffect } from "react";
import { trackMetaEvent } from "@/lib/metaPixel";
import { useLanguage } from "@/lib/LanguageContext";

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [hasCodeChecked, setHasCodeChecked] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const { t, language } = useLanguage();

  useEffect(() => {
    const code = localStorage.getItem("mw_discount_code");
    const expiresStr = localStorage.getItem("mw_discount_expires");
    if (code && expiresStr) {
      const expiresAt = parseInt(expiresStr);
      if (expiresAt > Date.now()) {
        setHasCodeChecked(true);
        setDiscountCode(code);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    
    const formData = new FormData(e.currentTarget);
    // Add Web3Forms Access Key
    formData.append("access_key", "08d8ff18-25e2-4708-bc67-7b76c4879483");

    // Check for active discount code in the visual input
    if (hasCodeChecked && discountCode.trim()) {
      const messageVal = formData.get("message") as string;
      const level = localStorage.getItem("mw_discount_level") || "10";
      formData.set("message", `${messageVal}\n\n--- AUTO-APPENDED INFO ---\nDISCOUNT CODE APPLIED: ${discountCode.trim()}\n(Valid for ${level}% Extra Discount)`);
    } else {
      // Fallback check in case they didn't check the box but the code is in localStorage
      const code = localStorage.getItem("mw_discount_code");
      const expiresStr = localStorage.getItem("mw_discount_expires");
      if (code && expiresStr) {
        const expiresAt = parseInt(expiresStr);
        if (expiresAt > Date.now()) {
          const messageVal = formData.get("message") as string;
          const level = localStorage.getItem("mw_discount_level") || "10";
          formData.set("message", `${messageVal}\n\n--- AUTO-APPENDED INFO ---\nDISCOUNT CODE APPLIED (HIDDEN): ${code}\n(Valid for ${level}% Extra Discount)`);
        }
      }
    }
    
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setIsSuccess(true);
        trackMetaEvent('Lead', { source: 'ContactForm' });
        (e.target as HTMLFormElement).reset();
        setTimeout(() => setIsSuccess(false), 5000); // Hide success message after 5 seconds
      } else {
        setErrorMessage(data.message || t("contact.alerts.errorDesc"));
      }
    } catch (error) {
      setErrorMessage(t("contact.alerts.errorDesc"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-32 bg-matte-black relative">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-10"
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                {t("contact.title1")} <br /><span className="text-gradient-gold">{t("contact.title2")}</span>
              </h2>
              <p className="text-gray-400 text-lg font-light max-w-md">
                {t("contact.description")}
              </p>
            </div>

            <div className="space-y-6">
              <a href="tel:+17542673047" onClick={() => trackMetaEvent('Contact', { method: 'Phone' }, true)} className="flex items-center gap-4 group cursor-pointer hover:opacity-80 transition-opacity">
                <div className="w-12 h-12 flex items-center justify-center bg-deep-charcoal border border-charcoal group-hover:border-metallic-gold transition-colors duration-300">
                  <Phone className="w-5 h-5 text-metallic-gold" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">
                    {language === "es" ? "Teléfono" : "Phone"}
                  </p>
                  <p className="text-white font-medium group-hover:text-metallic-gold transition-colors">+1 (754) 267-3047</p>
                </div>
              </a>
              
              <a href="mailto:millionwoodusa@gmail.com" onClick={() => trackMetaEvent('Contact', { method: 'Email' }, true)} className="flex items-center gap-4 group cursor-pointer hover:opacity-80 transition-opacity">
                <div className="w-12 h-12 flex items-center justify-center bg-deep-charcoal border border-charcoal group-hover:border-metallic-gold transition-colors duration-300">
                  <Mail className="w-5 h-5 text-metallic-gold" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">Email</p>
                  <p className="text-white font-medium group-hover:text-metallic-gold transition-colors">millionwoodusa@gmail.com</p>
                </div>
              </a>

              <a href="https://maps.google.com/?q=7321+NW+61ST+STREET+MIAMI+FL+33166" target="_blank" rel="noopener noreferrer" onClick={() => trackMetaEvent('FindLocation', {}, true)} className="flex items-center gap-4 group cursor-pointer hover:opacity-80 transition-opacity">
                <div className="w-12 h-12 flex items-center justify-center bg-deep-charcoal border border-charcoal group-hover:border-metallic-gold transition-colors duration-300">
                  <MapPin className="w-5 h-5 text-metallic-gold" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">
                    {language === "es" ? "Taller y Showroom" : "Studio & Shop"}
                  </p>
                  <p className="text-white font-medium group-hover:text-metallic-gold transition-colors">7321 NW 61ST STREET MIAMI FL 33166</p>
                  <p className="text-xs text-metallic-gold mt-1 uppercase tracking-widest font-semibold">
                    {language === "es" ? "* Solamente con cita previa" : "* By appointment only"}
                  </p>
                </div>
              </a>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-deep-charcoal p-8 md:p-12 border border-charcoal"
          >
            <form 
              className="space-y-6" 
              onSubmit={handleSubmit}
              onFocus={() => {
                if (!(window as any)._formStartedTracked) {
                  if (typeof window !== 'undefined') {
                    window.history.pushState({}, '', '/?section=contact-form');
                  }
                  trackMetaEvent('StartedForm', {}, true);
                  (window as any)._formStartedTracked = true; // Prevents firing multiple times
                }
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs uppercase tracking-widest text-gray-500 font-semibold">{t("contact.fields.name")}</label>
                  <input 
                    type="text" 
                    id="name"
                    name="name"
                    required
                    className="w-full bg-matte-black border border-charcoal px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-metallic-gold focus:ring-1 focus:ring-metallic-gold transition-all duration-300"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs uppercase tracking-widest text-gray-500 font-semibold">{t("contact.fields.email")}</label>
                  <input 
                    type="email" 
                    id="email"
                    name="email"
                    required
                    className="w-full bg-matte-black border border-charcoal px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-metallic-gold focus:ring-1 focus:ring-metallic-gold transition-all duration-300"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-xs uppercase tracking-widest text-gray-500 font-semibold">{t("contact.fields.phone")}</label>
                  <input 
                    type="tel" 
                    id="phone"
                    name="phone"
                    required
                    className="w-full bg-matte-black border border-charcoal px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-metallic-gold focus:ring-1 focus:ring-metallic-gold transition-all duration-300"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="service" className="text-xs uppercase tracking-widest text-gray-500 font-semibold">{t("contact.fields.interest")}</label>
                  <select 
                    id="service"
                    name="service"
                    required
                    className="w-full bg-matte-black border border-charcoal px-4 py-3 text-white focus:outline-none focus:border-metallic-gold focus:ring-1 focus:ring-metallic-gold transition-all duration-300 appearance-none"
                  >
                    <option value="">{t("contact.fields.selectInterest")}</option>
                    <option value="kitchen">{t("contact.fields.kitchens")}</option>
                    <option value="closets">{t("contact.fields.closets")}</option>
                    <option value="cnc">{t("contact.fields.cnc")}</option>
                    <option value="panels">{t("contact.fields.panels")}</option>
                    <option value="other">{t("contact.fields.custom")}</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4 pt-2 border-t border-charcoal/50">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input 
                      type="checkbox" 
                      checked={hasCodeChecked}
                      onChange={(e) => setHasCodeChecked(e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="w-5 h-5 bg-matte-black border border-charcoal rounded-sm peer-checked:bg-metallic-gold peer-checked:border-metallic-gold transition-colors flex items-center justify-center shadow-inner">
                      <svg className="w-3 h-3 text-matte-black opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
                    {language === "es" ? "Tengo un código de descuento Golden Ticket" : "I have a Golden Ticket discount code"}
                  </span>
                </label>

                <AnimatePresence>
                  {hasCodeChecked && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2 overflow-hidden"
                    >
                      <label htmlFor="discountCode" className="text-xs uppercase tracking-widest text-metallic-gold font-semibold flex items-center gap-2">
                        <Sparkles className="w-3 h-3" /> {language === "es" ? "Código de Descuento" : "Discount Code"}
                      </label>
                      <input 
                        type="text" 
                        id="discountCode"
                        name="discountCode"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                        className="w-full bg-matte-black/50 border border-metallic-gold/50 px-4 py-3 text-metallic-gold font-mono font-bold uppercase tracking-widest placeholder-gray-600 focus:outline-none focus:border-metallic-gold focus:ring-1 focus:ring-metallic-gold transition-all duration-300"
                        placeholder="MW-XXXX"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-2 pt-2">
                <label htmlFor="message" className="text-xs uppercase tracking-widest text-gray-500 font-semibold">{t("contact.fields.message")}</label>
                <textarea 
                  id="message"
                  name="message"
                  required
                  rows={5}
                  className="w-full bg-matte-black border border-charcoal px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-metallic-gold focus:ring-1 focus:ring-metallic-gold transition-all duration-300 resize-none"
                  placeholder={t("contact.fields.messagePlaceholder")}
                ></textarea>
              </div>
              
              {errorMessage && (
                <p className="text-red-500 text-sm font-medium">{errorMessage}</p>
              )}
              
              {isSuccess && (
                <div className="p-6 bg-matte-black border border-metallic-gold text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-metallic-gold/5 animate-pulse"></div>
                  <h4 className="text-metallic-gold font-bold uppercase tracking-widest text-sm mb-2">{t("contact.alerts.successTitle")}</h4>
                  <p className="text-gray-300 text-xs font-light leading-relaxed">{t("contact.alerts.successDesc")}</p>
                </div>
              )}

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-metallic-gold text-matte-black font-bold uppercase tracking-wider text-sm hover:bg-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? t("contact.fields.submitting") : t("contact.fields.submit")}
              </button>

              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-charcoal/50">
                <div className="flex flex-col items-center justify-center text-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-metallic-gold" />
                  <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold leading-tight">
                    {language === "es" ? "Licencia y Seguro" : "Licensed & Insured"}
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center text-center gap-2">
                  <Gem className="w-5 h-5 text-metallic-gold" />
                  <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold leading-tight">
                    {language === "es" ? "Materiales Premium" : "Premium Materials"}
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center text-center gap-2">
                  <MapPin className="w-5 h-5 text-metallic-gold" />
                  <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold leading-tight">
                    {language === "es" ? "Fabricado en Miami" : "Crafted in Miami"}
                  </span>
                </div>
              </div>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
