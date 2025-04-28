"use client";
import { motion } from "framer-motion";
import { Image, User, Award, DollarSign } from "lucide-react";
import PhotographyForm from "@/components/forms/photography-form";

export default function PhotographyPage() {
 

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Section */}
      <div className="lg:w-1/2 relative h-[500px] lg:h-auto">
        <div
          className="absolute inset-0 bg-[url('/images/photography-bg.jpg')] bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/images/photography-bg.jpg')",
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-white max-w-lg"
            >
              <motion.h1
                className="text-4xl font-bold mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Elevate Your{" "}
                <span className="text-blue-300">Photography Business</span>
              </motion.h1>

              <motion.p
                className="text-lg mb-8 text-gray-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Join thousands of photographers growing their careers on our
                platform
              </motion.p>

              <motion.ul
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {[
                  {
                    icon: <Image className="h-6 w-6" />,
                    text: "Showcase your portfolio",
                  },
                  {
                    icon: <DollarSign className="h-6 w-6" />,
                    text: "Sell your photos",
                  },
                  {
                    icon: <User className="h-6 w-6" />,
                    text: "Find new clients",
                  },
                  {
                    icon: <Award className="h-6 w-6" />,
                    text: "Join competitions",
                  },
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="flex items-center gap-4 p-4 rounded-xl backdrop-blur-sm"
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.1) 100%)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    <div className="bg-blue-500/20 p-2 rounded-full">
                      {item.icon}
                    </div>
                    <span className="font-medium">{item.text}</span>
                  </motion.li>
                ))}
              </motion.ul>

              <motion.div
                className="hidden md:block mt-8  text-sm text-gray-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                Trusted by 10,000+ professional photographers worldwide
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="lg:w-1/2 p-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-2xl"
        >
         <PhotographyForm/>
        </motion.div>
      </div>
    </div>
  );
}
