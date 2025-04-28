import mongoose, { Schema, model, Document } from "mongoose";

// Type definition
interface IUserSurvey extends Document {
  fingerprint: string;
  ageRange: "Under 18" | "18-24" | "25-34" | "35-44" | "45-54" | "55+";
  occupation: string;
  usageFrequency: "never" | "rarely" | "occasionally" | "frequently";
  useCases: string[];
  willingToPay: boolean;
  maxPrice?: number;
  paymentPreference?: "per_photo" | "subscription" | "credits";
  barriers?: string[];
  conversionFactors?: string[];
  contestParticipation?: "voter" | "submitter" | "none";
  desiredFeatures?: string[];
  metadata: {
    ip: string;
    userAgent: string;
  };
  createdAt: Date;
}

const UserSurveySchema = new Schema<IUserSurvey>({
  fingerprint: { type: String, required: true, unique: true },
  ageRange: {
    type: String,
    required: true,
    enum: ["Under 18", "18-24", "25-34", "35-44", "45-54", "55+"],
  },
  occupation: { type: String, required: true },
  usageFrequency: {
    type: String,
    required: true,
    enum: ["never", "rarely", "occasionally", "frequently"],
  },
  useCases: { type: [String], required: true },
  willingToPay: { type: Boolean, required: true },
  maxPrice: { type: Number, min: 1, max: 100 },
  paymentPreference: {
    type: String,
    enum: ["per_photo", "subscription", "credits"],
  },
  barriers: { type: [String] },
  conversionFactors: { type: [String] },
  contestParticipation: {
    type: String,
    enum: ["voter", "submitter", "none"],
  },
  desiredFeatures: { type: [String] },
  metadata: {
    ip: { type: String, required: true },
    userAgent: { type: String, required: true },
  },
  createdAt: { type: Date, default: Date.now },
});

if (mongoose.models.UserSurvey) {
  delete mongoose.models.UserSurvey;
}

const UserSurveyModel = model<IUserSurvey>("UserSurvey", UserSurveySchema);
export default UserSurveyModel
