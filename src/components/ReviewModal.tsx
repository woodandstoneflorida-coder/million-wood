"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Star, X } from "lucide-react";
import { useState } from "react";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReviewModal({ isOpen, onClose }: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    
    const formData = new FormData(e.currentTarget);
    formData.append("access_key", "08d8ff18-25e2-4708-bc67-7b76c4879483");
    formData.append("subject", "NUEVO TESTIMONIO - Pendiente de Moderación");
    formData.append("rating", rating.toString());

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          onClose();
        }, 4000);
      } else {
        setErrorMessage(data.message || "Something went wrong.");
      }
    } catch (error) {
      setErrorMessage("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-deep-charcoal border border-charcoal rounded-xl p-6 md:p-8 w-full max-w-md relative shadow-2xl shadow-black"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {isSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20">
                  <Star className="w-8 h-8 text-green-500 fill-green-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Review Submitted!</h3>
                <p className="text-gray-400 text-sm">
                  Thank you for your feedback. Your review has been sent and is pending moderation before it appears on the site.
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-white mb-2">Write a Review</h3>
                <p className="text-gray-400 text-sm mb-6">
                  Share your experience with Million Wood.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-500 font-semibold mb-2">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          className="focus:outline-none"
                        >
                          <Star 
                            className={`w-8 h-8 transition-colors ${
                              star <= (hoveredRating || rating) 
                                ? "fill-[#FBBC05] text-[#FBBC05]" 
                                : "text-gray-600"
                            }`} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="name" className="block text-xs uppercase tracking-widest text-gray-500 font-semibold mb-2">Your Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      required
                      placeholder="e.g. John D."
                      className="w-full bg-black/50 border border-gray-800 text-white px-4 py-3 focus:outline-none focus:border-metallic-gold transition-colors rounded-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="review" className="block text-xs uppercase tracking-widest text-gray-500 font-semibold mb-2">Your Review</label>
                    <textarea 
                      id="review" 
                      name="message" 
                      required
                      rows={4}
                      placeholder="Tell us about your experience..."
                      className="w-full bg-black/50 border border-gray-800 text-white px-4 py-3 focus:outline-none focus:border-metallic-gold transition-colors rounded-none resize-none"
                    ></textarea>
                  </div>

                  {errorMessage && (
                    <p className="text-red-500 text-sm">{errorMessage}</p>
                  )}

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-metallic-gold text-matte-black font-bold py-4 uppercase tracking-widest hover:bg-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
