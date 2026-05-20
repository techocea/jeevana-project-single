import { z } from "zod";

export const contactFormSchema = z.object({
  fullName: z.string().min(2, { message: "Full name is required" }),
  email: z.string().email({ message: "Enter a valid email address" }),
  interest: z.enum(["general", "partnership", "feedback", "membership"], {
    errorMap: () => ({ message: "Select an interest" }),
  }),
  message: z.string().min(10, { message: "Message is required" }),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
