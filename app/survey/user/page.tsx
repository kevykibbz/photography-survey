"use client";
import UserForm from "@/components/forms/user-form";
import { motion } from "framer-motion";
import { User, Award, Search, Calendar } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function UserPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Section */}
      <div className="lg:w-1/2 relative h-[500px] lg:h-auto hidden lg:flex">
        <div
          className="absolute inset-0 bg-[url('/images/user-survey-bg.jpg')] bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/images/user-survey-bg.jpg')",
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
                Find the Perfect{" "}
                <span className="text-blue-300">
                  Photographer for Your Event
                </span>
              </motion.h1>

              <motion.p
                className="text-lg mb-8 text-gray-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Discover top-rated photographers for weddings, corporate events,
                parties, and more — all in one place.
              </motion.p>

              <motion.ul
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {[
                  {
                    icon: <User className="h-6 w-6" />,
                    text: "Browse verified photographers",
                  },
                  {
                    icon: <Search className="h-6 w-6" />,
                    text: "Find the right match for your event",
                  },
                  {
                    icon: <Calendar className="h-6 w-6" />,
                    text: "Book effortlessly with real-time availability",
                  },
                  {
                    icon: <Award className="h-6 w-6" />,
                    text: "Hire top-rated professionals you can trust",
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
                className="hidden md:block mt-8 text-sm text-gray-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                Trusted by 10,000+ users to capture their most important moments
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
           {/* Breadcrumbs Section */}
           <div className="mb-3">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Photo Ethusiast Survey</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
         <UserForm/>
        </motion.div>
      </div>
    </div>
  );
}
