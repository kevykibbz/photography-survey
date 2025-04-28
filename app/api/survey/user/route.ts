import dbConnect from "@/lib/db/db-connect";
import { UserSurveyModel } from "@/models";
import { IUserSurvey } from "@/models/user-survey";
import { userSurveySchema } from "@/validations/validation";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fingerprint, ...surveyData } = body;
    const parsedData = userSurveySchema.parse(surveyData);

    await dbConnect();

    const existingSurvey = await UserSurveyModel.findOne({ fingerprint });
    if (existingSurvey) {
      return NextResponse.json(
        { message: "You have already submitted this survey" },
        { status: 400 }
      );
    }

    const newSurvey = new UserSurveyModel({
      fingerprint,
      ...parsedData,
      metadata: {
        ip: req.headers.get("x-forwarded-for") || "unknown",
        userAgent: req.headers.get("user-agent") || "unknown",
      },
      createdAt: new Date(),
    });

    await newSurvey.save();

    // Send Slack notification (fire-and-forget)
    sendUserSurveySlackNotification(newSurvey).catch(console.error);

    return NextResponse.json(
      { message: "Survey submitted successfully", data: newSurvey },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    if (error instanceof z.ZodError) {
      const errorDetails = error.errors.map((err) => ({
        message: err.message,
        path: err.path.join(" > "),
      }));

      return NextResponse.json(
        { message: "Invalid input", errors: errorDetails },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

async function sendUserSurveySlackNotification(survey: IUserSurvey) {
  const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;
  if (!SLACK_WEBHOOK_URL) {
    console.warn("SLACK_WEBHOOK_URL not configured - skipping notification");
    return;
  }

  try {
    // Helper function to format values for Slack
    const formatValue = (value: any): string => {
      if (value === undefined || value === null) return "Not provided";
      if (Array.isArray(value)) return value.length ? value.join(", ") : "None";
      if (typeof value === 'boolean') return value ? "✅ Yes" : "❌ No";
      return String(value);
    };

    // Prepare all survey fields for display
    const surveyFields = [
      { title: "Usage Frequency", value: survey.usageFrequency },
      { title: "Use Cases", value: survey.useCases.join(", ") },
      { title: "Self Photography Frequency", value: survey.selfPhotographyFrequency },
      { title: "Willing to Pay", value: formatValue(survey.willingToPay) },
      { title: "Max Price", value: survey.maxPrice || "Not specified" },
      { title: "Payment Preference", value: survey.paymentPreference || "Not specified" },
      { title: "Barriers", value: survey.barriers?.join(", ") || "None" },
      { title: "Conversion Factors", value: survey.conversionFactors?.join(", ") || "None" },
      { title: "Contest Participation", value: survey.contestParticipation || "None" },
      { title: "Age Range", value: survey.ageRange },
      { title: "Occupation", value: survey.occupation },
      { title: "Location Platform Interest", value: survey.locationPlatformInterest || "Not specified" },
      { title: "Platform Features", value: survey.platformFeatures?.join(", ") || "None" },
    ];

    // Additional explanation fields (if provided)
    const explanationFields = [];
    if (survey.conversionOtherExplanation) {
      explanationFields.push({
        title: "Other Conversion Explanation",
        value: survey.conversionOtherExplanation
      });
    }
    if (survey.locationPlatformExplanation) {
      explanationFields.push({
        title: "Location Platform Explanation",
        value: survey.locationPlatformExplanation
      });
    }
    if (survey.platformFeaturesOther) {
      explanationFields.push({
        title: "Other Platform Features",
        value: survey.platformFeaturesOther
      });
    }

    // Create Slack blocks
    const blocks = [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "👤 New User Survey Submission",
          emoji: true
        }
      },
      {
        type: "divider"
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Submitted At:*\n${survey.createdAt.toLocaleString()}`
          },
          {
            type: "mrkdwn",
            text: `*IP:*\n${survey.metadata.ip}`
          },
          {
            type: "mrkdwn",
            text: `*User Agent:*\n${survey.metadata.userAgent.substring(0, 30)}...`
          }
        ]
      },
      {
        type: "divider"
      },
      // Main survey responses (grouped in pairs)
      ...surveyFields.reduce((acc, field, index) => {
        if (index % 2 === 0) {
          acc.push({
            type: "section",
            fields: [
              {
                type: "mrkdwn",
                text: `*${field.title}:*\n${field.value}`
              },
              surveyFields[index + 1] ? {
                type: "mrkdwn",
                text: `*${surveyFields[index + 1].title}:*\n${surveyFields[index + 1].value}`
              } : {
                type: "mrkdwn",
                text: "* *" // Empty field for alignment
              }
            ]
          });
        }
        return acc;
      }, [] as any[]),
      // Additional explanations
      ...explanationFields.map(field => ({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${field.title}:*\n${field.value}`
        }
      }))
    ];

    await fetch(SLACK_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        blocks,
        text: `New user survey submission from ${survey.metadata.ip}`
      })
    });
  } catch (error) {
    console.error("Slack notification failed:", error);
  }
}