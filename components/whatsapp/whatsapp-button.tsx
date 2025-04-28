"use client";
import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

export function WhatsAppButton() {
  return (
    <div className="fixed bottom-6 right-6 z-100">
      {/* Ripple Effect Elements */}
      <div className="ripple-container">
        <div className="ripple-ring" />
        <div className="ripple-ring" />
        <div className="ripple-ring" />

        {/* Main Button */}
        <motion.a
          href="https://wa.me/254796268817"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative bg-green-500 text-white p-4 rounded-full shadow-xl flex items-center justify-center"
        >
          <MessageCircle className="h-6 w-6" />
        </motion.a>
      </div>
    </div>
  );
}
