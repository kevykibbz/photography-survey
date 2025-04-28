import { contactSchema, photographerSchema, userSurveySchema } from "@/validations/validation";
import Mail from "nodemailer/lib/mailer";
import { z } from "zod";

export type ContactFormData = z.infer<typeof contactSchema>;

export type ISendEmailTypes = {
  sender: Mail.Address;
  recipients: Mail.Address[];
  subject: string;
  message: string;
};

export type PhotographerFormData = z.infer<typeof photographerSchema>;

export type UserSurveyFormData=z.infer<typeof userSurveySchema>