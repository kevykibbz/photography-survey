import { sendEmail } from "@/utils/mails.utils";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;
    const sender = {
      name: name, 
      address: email, 
    };

    const recipients = [
      {
        name:process.env.MAIL_NAME as string,
        address:process.env.MAIL_USER as string
      },
    ];

    const response = await sendEmail({
      sender,
      recipients,
      subject: `New message from ${name}`, 
      message: message,
    });

    return NextResponse.json({
      accepted: response.accepted,
    });
  } catch (error) {
    console.error("Error sending email:", error);

    return NextResponse.json(
      {
        message: "Unable to send email at this time. Please try again later.",
      },
      { status: 500 }
    );
  }
}