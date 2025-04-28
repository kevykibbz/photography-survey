import dbConnect from "@/lib/db/db-connect";
import { PhotographerSurveyModel } from "@/models";
import { generateFingerprint } from "@/utils/generate-fingerprint";
import { photographerSchema } from "@/validations/validation";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();
    const { fingerprint, ...surveyData } = body;
    const parsedData = photographerSchema.parse(surveyData);

    await dbConnect();

    // Check if the fingerprint already exists in the database
    const existingSubmission = await PhotographerSurveyModel.findOne({
      fingerprint,
    });

    if (existingSubmission) {
      return NextResponse.json(
        { message: "You have alraedy submitted this survey" },
        { status: 400 }
      );
    }

    // Create a new photographer survey document
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

    // Save the document to the database
    await newSurvey.save();

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
