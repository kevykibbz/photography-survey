import { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";

export const generateFingerprint = (req: NextRequest) => {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const userAgent = req.headers.get("user-agent");
  const sessionId = req.cookies.get("sessionId")?.value || uuidv4();

  const fingerprint = `${userAgent}-${ip}-${sessionId}`;
  return fingerprint;
};