"use client";

import { ShieldCheck, Check } from "lucide-react";
import { motion } from "framer-motion";

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center mb-12"
      >
        <div className="bg-blue-100/50 p-4 rounded-full mb-4">
          <ShieldCheck className="h-8 w-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-center">Privacy Policy</h1>
        <p className="text-muted-foreground mt-2">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </motion.div>

      <div className="space-y-12">
        {[
          {
            title: "Information We Collect",
            description:
              "We collect minimal personal data necessary to provide our services. This may include:",
            items: [
              "Account information (email, username, profile photo)",
              "Content you upload (photos, comments, likes)",
              "Basic usage analytics (page views, interactions)",
              "Device and browser information",
              "Location data (if you allow it)",
            ],
            delay: 0.2,
          },
          {
            title: "How We Use Your Data",
            description: "Your information is used solely to:",
            items: [
              "Provide and improve our services",
              "Communicate important updates and support responses",
              "Personalize your experience (location-based suggestions)",
              "Ensure platform security and prevent misuse",
              "Comply with legal obligations",
            ],
            delay: 0.4,
          },
          {
            title: "Data Sharing",
            description:
              "We do not sell or rent your personal data to third parties. We may share information only with:",
            items: [
              "Trusted service providers assisting us (hosting, analytics)",
              "Authorities when legally required (e.g., law enforcement)",
            ],
            delay: 0.6,
          },
          {
            title: "Your Rights",
            description: "You have full control over your data. You can:",
            items: [
              "Access, update, or delete your account information",
              "Request a copy of your data",
              "Withdraw consent for data collection",
            ],
            delay: 0.8,
          },
          {
            title: "Data Security",
            description:
              "We implement strong security measures to protect your data, including encryption, secure servers, and regular audits.",
            items: [],
            delay: 1,
          },
        ].map((section, idx) => (
          <motion.section
            key={idx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: section.delay }}
            className="prose prose-sm dark:prose-invert"
          >
            <h2 className="text-2xl font-semibold text-primary mb-2">
              {section.title}
            </h2>
            <p className="text-muted-foreground mb-6">{section.description}</p>

            {section.items.length > 0 && (
              <ul className="space-y-4">
                {section.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="h-8 w-8 flex items-center justify-center rounded-full bg-gradient-to-r from-[#5bbad5] to-[#5bbad5]/70 shrink-0">
                      <Check className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-muted-foreground leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </motion.section>
        ))}
      </div>
    </div>
  );
}
