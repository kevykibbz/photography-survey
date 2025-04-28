"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Camera, User, Check, Flashlight } from "lucide-react";
import Link from "next/link";

export default function RoleSelection() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  const features = [
    "Discover talented photographers",
    "Sell your photography work",
    "Join monthly photo contests",
    "Get location-based recommendations",
    "Secure digital downloads",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 flex flex-col relative overflow-hidden">
      {/* Camera Flash Animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0, 0.3, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatDelay: 5,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 right-1/4"
      >
        <Flashlight size={120} className="text-yellow-200/30 rotate-45" />
      </motion.div>

      <div className="flex flex-col lg:flex-row items-center justify-center min-h-[calc(100vh-2rem)] gap-8 max-w-7xl mx-auto w-full py-12 z-10">
        {/* Left Section - Content */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-full lg:w-1/2 h-full flex flex-col justify-center p-6 lg:p-12 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden"
        >
          {/* Camera Icon */}
          <div className="absolute bottom-4 right-4 opacity-10 transform rotate-12 scale-150">
            <Camera className="w-32 h-32 text-gray-400" />
          </div>

          {/* Main Content */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-8"
          >
            <motion.div variants={item}>
              <h1 className="text-4xl font-bold text-gray-900">
                Welcome to <span className="text-primary">PhotoShowcase</span>
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                The premier platform connecting photographers with enthusiasts
              </p>
            </motion.div>

            <motion.div variants={item} className="space-y-4">
              <h2 className="text-xl font-semibold">
                What You&apos;ll Gain with PhotoShowcase
              </h2>
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <motion.li
                    key={index}
                    variants={item}
                    className="flex items-center gap-3"
                  >
                    <div className="h-8 w-8 flex items-center justify-center rounded-full bg-gradient-to-r from-[#5bbad5] to-[#5bbad5]/70">
                      <Check className="h-5 w-5 text-white" />
                    </div>
                    <span>{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Right Section - Buttons */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full lg:w-1/2 h-full flex flex-col justify-center p-6 lg:p-12"
        >
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-8"
          >
            <motion.div variants={item}>
              <h2 className="text-2xl font-bold text-center mb-6">
                Get started as
              </h2>
              <div className="space-y-6">
                <motion.div
                  variants={item}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    asChild
                    className="h-20 w-full flex gap-2 text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    <Link href="/survey/photographer">
                      <Camera className="h-12 w-12" />
                      <span>Photographer</span>
                    </Link>
                  </Button>
                </motion.div>

                <motion.div
                  variants={item}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    asChild
                    className="h-20 w-full flex gap-2 text-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                  >
                    <Link href="/survey/user">
                      <User className="h-12 w-12" />
                      <span>Photo Enthusiast</span>
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              variants={item}
              className="text-center text-muted-foreground text-sm"
            >
              Your feedback helps us build a better platform
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
