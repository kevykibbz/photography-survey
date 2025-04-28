import mongoose, { Schema, model, Document } from "mongoose";
import { CallbackError, HydratedDocument } from "mongoose";

// Define the IUserSurvey interface
interface IUserSurvey extends Document {
  fingerprint: string; // unique identifier for each user survey
  usageFrequency: "never" | "rarely" | "occasionally" | "frequently";
  useCases: string[];
  selfPhotographyFrequency: "never" | "rarely" | "occasionally" | "frequently";
  willingToPay: boolean;
  maxPrice?: string; // $1–$5, etc.
  paymentPreference?: "per_photo" | "subscription" | "credits";
  barriers?: string[];
  conversionFactors?: string[];
  conversionOtherExplanation?: string;
  contestParticipation?: "voter" | "submitter" | "none";
  ageRange: "Under 18" | "18-24" | "25-34" | "35-44" | "45-54" | "55+";
  occupation: string;
  locationPlatformInterest?: "yes" | "no" | "maybe";
  locationPlatformExplanation?: string;
  platformFeatures?: string[];
  platformFeaturesOther?: string;
  metadata: {
    ip: string;
    userAgent: string;
  };
  createdAt: Date;
}

// Mongoose Schema definition
const UserSurveySchema = new Schema<IUserSurvey>({
  fingerprint: { type: String, required: true }, // unique identifier for survey
  usageFrequency: {
    type: String,
    required: true,
    enum: ["never", "rarely", "occasionally", "frequently"],
  },
  useCases: { type: [String], required: true },
  selfPhotographyFrequency: {
    type: String,
    required: true,
    enum: ["never", "rarely", "occasionally", "frequently"],
  },
  willingToPay: { type: Boolean, required: true },
  maxPrice: { type: String },
  paymentPreference: {
    type: String,
    enum: ["per_photo", "subscription", "credits"],
  },
  barriers: { type: [String] },
  conversionFactors: { type: [String] },
  conversionOtherExplanation: { type: String },
  contestParticipation: { type: String, enum: ["voter", "submitter", "none"] },
  ageRange: {
    type: String,
    required: true,
    enum: ["Under 18", "18-24", "25-34", "35-44", "45-54", "55+"],
  },
  occupation: { type: String, required: true },
  locationPlatformInterest: { type: String, enum: ["yes", "no", "maybe"] },
  locationPlatformExplanation: { type: String },
  platformFeatures: { type: [String] },
  platformFeaturesOther: { type: String },
  metadata: {
    ip: { type: String, required: true },
    userAgent: { type: String, required: true },
  },
  createdAt: { type: Date, default: Date.now },
});

// Error handling for duplicate survey submissions
interface IPostSaveError extends Error {
  name: string;
  code?: number;
}

interface IPostSaveDoc extends HydratedDocument<IUserSurvey> {}

UserSurveySchema.post<IPostSaveDoc>(
  "save",
  function (
    error: IPostSaveError,
    doc: IPostSaveDoc,
    next: (err?: CallbackError) => void
  ) {
    if (error.name === "MongoError" && error.code === 11000) {
      next(new Error("Duplicate survey submission detected"));
    } else {
      next();
    }
  }
);

if (mongoose.models.UserSurvey) {
  delete mongoose.models.UserSurvey;
}

const UserSurveyModel = model<IUserSurvey>("UserSurvey", UserSurveySchema);

export default UserSurveyModel;
