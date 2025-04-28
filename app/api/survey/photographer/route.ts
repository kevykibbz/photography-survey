import dbConnect from "@/lib/db/db-connect";
import { PhotographerSurveyModel } from "@/models";
import { IPhotographerSurvey } from "@/models/photography-survey";
import { photographerSchema } from "@/validations/validation";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fingerprint, ...surveyData } = body;
    const parsedData = photographerSchema.parse(surveyData);

    await dbConnect();

    // Check for existing submission
    const existingSubmission = await PhotographerSurveyModel.findOne({
      fingerprint,
    });
    if (existingSubmission) {
      return NextResponse.json(
        { message: "You have already submitted this survey" },
        { status: 400 }
      );
    }

    // Create new survey
    const newSurvey = new PhotographerSurveyModel({
      fingerprint,
      ...parsedData,
      metadata: {
        ip: req.headers.get("x-forwarded-for") || "unknown",
        userAgent: req.headers.get("user-agent") || "",
        sessionId: fingerprint,
        firstSeenAt: new Date(),
        lastSeenAt: new Date(),
      },
      createdAt: new Date(),
    });

    await newSurvey.save();

    // Send Slack notification (in background, don't await)
    sendSlackNotification(newSurvey).catch(console.error);

    return NextResponse.json(
      { message: "Survey submitted successfully", data: newSurvey },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      const errorDetails = error.errors.map((err) => ({
        message: err.message,
        path: err.path.join(" > "),
      }));
      return NextResponse.json(
        { message: "Invalid data", errors: errorDetails },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

async function sendSlackNotification(survey: IPhotographerSurvey) {
  const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;
  if (!SLACK_WEBHOOK_URL) {
    console.warn("SLACK_WEBHOOK_URL not set - skipping notification");
    return;
  }

  try {
    // Helper to format object values
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formatValue = (value: any): string => {
      if (value === undefined || value === null) return "Not provided";
      if (Array.isArray(value)) return value.length ? value.join(", ") : "None";
      if (typeof value === "object") return formatObject(value);
      if (typeof value === "boolean") return value ? "✅ Yes" : "❌ No";
      return String(value);
    };

    // Special formatting for nested objects
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formatObject = (obj: Record<string, any>): string => {
      return Object.entries(obj)
        .map(([key, val]) => {
          if (val === undefined || val === null) return null;
          return `${key}: ${formatValue(val)}`;
        })
        .filter(Boolean)
        .join("\n");
    };

    // Prepare all fields for Slack
    const fields = [
      { title: "Specialty", value: survey.specialty },
      { title: "Experience", value: survey.experienceYears },
      { title: "Current Platforms", value: survey.currentPlatforms.join(", ") },
      {
        title: "Selling Platforms",
        value: survey.sellingPlatforms?.join(", ") || "None",
      },
      { title: "Commission Acceptance", value: survey.commissionAcceptance },
      { title: "Main Concerns", value: survey.concerns?.join(", ") || "None" },
      {
        title: "Feature Requests",
        value: survey.featureRequests?.join(", ") || "None",
      },
      {
        title: "Collaboration Preferences",
        value: survey.collaborationPrefs?.join(", ") || "None",
      },
      { title: "Interests", value: formatObject(survey.interests) },
      {
        title: "Premium Features",
        value: formatObject(survey.premiumFeatures),
      },
      {
        title: "Additional Opinions",
        value: formatObject(survey.additionalFeatureOpinions || {}),
      },
    ];

    // Create Slack blocks
    const blocks = [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "📸 New Photographer Survey Submission",
          emoji: true,
        },
      },
      {
        type: "divider",
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Submitted At:*\n${survey.createdAt.toLocaleString()}`,
          },
          {
            type: "mrkdwn",
            text: `*IP:*\n${survey.metadata.ip}`,
          },
        ],
      },
      ...fields.map((field) => ({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${field.title}:*\n${field.value}`,
        },
      })),
      {
        type: "divider",
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Additional Notes:*\n${
            survey.featureRequestsOther || "None provided"
          }`,
        },
      },
    ];

    await fetch(SLACK_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        blocks,
        text: `New photographer survey from ${survey.metadata.ip}`,
      }),
    });
  } catch (error) {
    console.error("Failed to send Slack notification:", error);
  }
}
