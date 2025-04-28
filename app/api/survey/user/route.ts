import dbConnect from "@/lib/db/db-connect";
import { UserSurveyModel } from "@/models";
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

    // Create a new survey document
    const newSurvey = new UserSurveyModel({
      fingerprint,
      ...parsedData,
      metadata: {
        ip: req.headers.get("x-forwarded-for") || "unknown",
        userAgent: req.headers.get("user-agent") || "unknown",
      },
      createdAt: new Date(),
    });

    // Save to DB
    await newSurvey.save();

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
