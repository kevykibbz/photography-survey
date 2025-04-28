"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="fixed bottom-0 left-0 right-0 border-t bg-white/50 backdrop-blur-sm dark:bg-gray-950/50 z-50"
    >
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex flex-col items-center gap-2 text-center md:flex-row md:gap-4 md:text-left">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {currentYear} PhotoShowcase. All rights reserved.
            </p>
            <span className="hidden h-1 w-1 rounded-full bg-gray-300 md:inline-block dark:bg-gray-700" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Developed by{" "}
              <Link
                href="https://tevinly.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[#5bbad5] underline-offset-4 hover:underline dark:text-[#5bbad5]"
              >
                Tevinly
              </Link>
            </p>
          </div>

          <div className="flex items-center space-x-6">
            <Link
              href="/"
              className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              Home
            </Link>{" "}
            <Link
              href="/terms"
              className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              Privacy
            </Link>
            <Link
              href="/contact"
              className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
