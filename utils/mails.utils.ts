import { ISendEmailTypes } from "@/types/types";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { generateEmailTemplate } from "./generate-email-template";

const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
} as SMTPTransport.Options);

export const sendEmail = async (dto: ISendEmailTypes) => {
  const { sender, recipients, subject, message } = dto;
  const { name: clientName, address: clientEmail } = sender;
  const htmlContent = generateEmailTemplate({
    businessName: process.env.MAIL_NAME as string,
    clientName,
    clientEmail,
    subject,
    message,
  });
  return await transport.sendMail({
    from: sender,
    to: recipients,
    subject,
    html: htmlContent,
    text: message,
  });
};
