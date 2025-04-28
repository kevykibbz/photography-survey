"use client";

import { FileText, Check } from "lucide-react";
import { motion } from "framer-motion";

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center mb-12"
      >
        <div className="bg-purple-100/50 p-4 rounded-full mb-4">
          <FileText className="h-8 w-8 text-purple-600" />
        </div>
        <h1 className="text-3xl font-bold text-center">Terms of Service</h1>
        <p className="text-muted-foreground mt-2">Effective: {new Date().toLocaleDateString()}</p>
      </motion.div>

      <div className="space-y-12">
        {/* User Responsibilities */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="prose prose-sm dark:prose-invert"
        >
          <h2 className="text-2xl font-semibold text-primary mb-2">User Responsibilities</h2>
          <p className="text-muted-foreground mb-6">
            By accessing or using our platform, you agree to the following responsibilities:
          </p>
          <ul className="space-y-4">
            {[
              "Provide accurate, up-to-date personal information",
              "Respect copyrights and intellectual property of others",
              "Avoid abusive, harmful, or illegal activities",
              "Keep your account credentials secure",
              "Report any security vulnerabilities responsibly",
            ].map((item, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <div className="h-8 w-8 flex items-center justify-center rounded-full bg-gradient-to-r from-[#a78bfa] to-[#c4b5fd]/70">
                  <Check className="h-5 w-5 text-white" />
                </div>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.section>

        {/* Content Ownership */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="prose prose-sm dark:prose-invert"
        >
          <h2 className="text-2xl font-semibold text-primary mb-2">Content Ownership</h2>
          <p className="text-muted-foreground mb-6">
            You retain ownership of the content you create and share on our platform. However, by posting or uploading
            content, you grant us a limited, worldwide, royalty-free license to host, use, and display such content
            solely to operate and improve our services.
          </p>
          <ul className="space-y-4">
            {[
              "You can remove your content at any time",
              "We will never claim ownership of your work",
              "You are responsible for ensuring your content does not infringe on others’ rights",
            ].map((item, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <div className="h-8 w-8 flex items-center justify-center rounded-full bg-gradient-to-r from-[#a78bfa] to-[#c4b5fd]/70">
                  <Check className="h-5 w-5 text-white" />
                </div>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.section>

        {/* Termination of Service */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="prose prose-sm dark:prose-invert"
        >
          <h2 className="text-2xl font-semibold text-primary mb-2">Termination of Service</h2>
          <p className="text-muted-foreground mb-6">
            We reserve the right to suspend or terminate your account if you violate these Terms or engage in any
            behavior that harms our community or services.
          </p>
          <ul className="space-y-4">
            {[
              "Violation of any terms listed",
              "Abusive behavior towards staff or users",
              "Fraudulent or illegal activities",
            ].map((item, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <div className="h-8 w-8 flex items-center justify-center rounded-full bg-gradient-to-r from-[#a78bfa] to-[#c4b5fd]/70">
                  <Check className="h-5 w-5 text-white" />
                </div>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.section>

        {/* Changes to Terms */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="prose prose-sm dark:prose-invert"
        >
          <h2 className="text-2xl font-semibold text-primary mb-2">Changes to Terms</h2>
          <p className="text-muted-foreground mb-6">
            We may update these Terms from time to time. If significant changes occur, we will notify you by email or
            through a prominent notice on our platform.
          </p>
        </motion.section>
      </div>
    </div>
  );
}
