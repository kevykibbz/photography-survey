import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" })
});



export const photographerSchema = z.object({
  // Professional Background
  specialty: z.enum(["Wedding", "Portrait", "Landscape", "Events", "Commercial", "Other"]),
  experienceYears: z.enum(["<1", "1-3", "3-5", "5+"]),
  
  // Current Online Presence
  currentPlatforms: z.array(z.string()).min(1, "Select at least one platform"),
  sellingPlatforms: z.array(z.string()).optional(),
  sellingPlatformsOther: z.string().optional(),
  
  // Interest in Platform
  interests: z.object({
    showcase: z.number().min(1).max(5).optional(),
    sell: z.number().min(1).max(5).optional(),
    discovery: z.number().min(1).max(5).optional(),
    contests: z.number().min(1).max(5).optional()
  }),
  
  // Monetization & Pricing
  premiumFeatures: z.object({
    featured: z.number().min(1).max(5).optional(),
    storage: z.number().min(1).max(5).optional(),
    contestEntries: z.number().min(1).max(5).optional()
  }),
  commissionAcceptance: z.enum(["10%", "20%", "30%", "flat"]),
  
  // Concerns & Suggestions
  concerns: z.array(z.string()).optional(),
  featureRequests: z.array(z.string()).optional(),
  featureRequestsOther: z.string().optional(),
  
  // Collaboration Preferences
  collaborationPrefs: z.array(z.string()).optional(),
  
  // Additional Fields from Model
  additionalFeatureOpinions: z.object({
    desiredFeatures: z.string().optional()
      .describe("What additional features would you like to see on our platform?"),
    importance: z.enum(["low", "medium", "high"]).optional()
      .describe("How important are these features to you?"),
    willingToPay: z.boolean().optional()
      .describe("Would you be willing to pay for these features?")
  }).optional(),
});
