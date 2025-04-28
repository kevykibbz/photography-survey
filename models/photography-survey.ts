import mongoose, { Schema, model, Document } from "mongoose";
import { CallbackError, HydratedDocument } from "mongoose";

export interface IPhotographerSurvey extends Document {
  fingerprint: string;
  specialty:
    | "Wedding"
    | "Portrait"
    | "Landscape"
    | "Events"
    | "Commercial"
    | "Other";
  experienceYears: "<1" | "1-3" | "3-5" | "5+";
  currentPlatforms: string[];
  sellingPlatforms?: string[];
  sellingPlatformsOther?: string;
  interests: {
    showcase?: number;
    sell?: number;
    discovery?: number;
    contests?: number;
  };
  premiumFeatures: {
    featured?: number;
    storage?: number;
    contestEntries?: number;
  };
  commissionAcceptance: "10%" | "20%" | "30%" | "flat";
  concerns?: string[];
  featureRequests?: string[];
  featureRequestsOther?: string;
  collaborationPrefs?: string[];
  additionalFeatureOpinions?: {
    desiredFeatures?: string;
    importance?: "low" | "medium" | "high";
    willingToPay?: boolean;
  };
  metadata: {
    ip: string;
    userAgent: string;
    sessionId: string;
    firstSeenAt: Date;
    lastSeenAt: Date;
  };
  createdAt: Date;
}

const PhotographerSurveySchema = new Schema<IPhotographerSurvey>({
  fingerprint: { type: String, required: true},
  specialty: {
    type: String,
    required: true,
    enum: ["Wedding", "Portrait", "Landscape", "Events", "Commercial", "Other"],
  },
  experienceYears: {
    type: String,
    required: true,
    enum: ["<1", "1-3", "3-5", "5+"],
  },
  currentPlatforms: { type: [String], required: true },
  sellingPlatforms: { type: [String] },
  sellingPlatformsOther: { type: String },
  interests: {
    showcase: { type: Number, min: 1, max: 5 },
    sell: { type: Number, min: 1, max: 5 },
    discovery: { type: Number, min: 1, max: 5 },
    contests: { type: Number, min: 1, max: 5 },
  },
  premiumFeatures: {
    featured: { type: Number, min: 1, max: 5 },
    storage: { type: Number, min: 1, max: 5 },
    contestEntries: { type: Number, min: 1, max: 5 },
  },
  commissionAcceptance: {
    type: String,
    enum: ["10%", "20%", "30%", "flat"],
  },
  concerns: { type: [String] },
  featureRequests: { type: [String] },
  featureRequestsOther: { type: String },
  collaborationPrefs: { type: [String] },
  additionalFeatureOpinions: {
    desiredFeatures: { type: String },
    importance: { type: String, enum: ["low", "medium", "high"] },
    willingToPay: { type: Boolean },
  },
  metadata: {
    ip: { type: String, required: true },
    userAgent: { type: String, required: true },
    sessionId: { type: String, required: true },
    firstSeenAt: { type: Date, default: Date.now },
    lastSeenAt: { type: Date, default: Date.now },
  },
  createdAt: { type: Date, default: Date.now },
});

PhotographerSurveySchema.index({ fingerprint: 1 }, { unique: true });

// Catch duplicates and handle them gracefully
interface IPostSaveError extends Error {
  name: string;
  code?: number;
}

interface IPostSaveDoc extends HydratedDocument<IPhotographerSurvey> {}

PhotographerSurveySchema.post<IPostSaveDoc>(
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

if (mongoose.models.PhotographerSurvey) {
  delete mongoose.models.PhotographerSurvey;
}
const PhotographerSurveyModel = model<IPhotographerSurvey>(
  "PhotographerSurvey",
  PhotographerSurveySchema
);

export default PhotographerSurveyModel;
