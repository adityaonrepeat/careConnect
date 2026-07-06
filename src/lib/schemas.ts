import { z } from "zod";

const fullName = z
  .string()
  .trim()
  .min(2, { message: "Please enter your full name" })
  .max(100, { message: "Please keep the name under 100 characters" });

const email = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email({ message: "Enter a valid email address" }));

const phone = z
  .string()
  .trim()
  .min(7, { message: "Enter a valid phone number" })
  .max(20, { message: "Enter a valid phone number" })
  .regex(/^[+]?[\d\s().-]+$/, { message: "Enter a valid phone number" })
  .refine((v) => v.replace(/\D/g, "").length >= 7, {
    message: "Enter a valid phone number",
  });

const city = z
  .string()
  .trim()
  .min(2, { message: "Enter your city" })
  .max(80, { message: "Please keep the city under 80 characters" });

const description = z
  .string()
  .trim()
  .min(10, { message: "Please add a little more detail (at least 10 characters)" })
  .max(1000, { message: "Please keep this under 1000 characters" });

const honeypot = z.string().optional();

export const PATIENT_TYPES = ["Self", "Family Member", "Caregiver"] as const;

export const SUPPORT_OPTIONS = [
  "Treatment Guidance",
  "Medical Report Review",
  "Financial Assistance",
  "Nutrition Counseling",
  "Emotional & Peer Support",
  "Healing Hearts Community",
  "Other",
] as const;

export const CONTACT_METHODS = ["Phone", "Email", "WhatsApp"] as const;

export const AVAILABILITY = ["Weekdays", "Weekends", "Flexible"] as const;

export const patientSchema = z.object({
  name: fullName,
  email,
  phone,
  city,
  patientType: z.enum(PATIENT_TYPES, { message: "Please select who needs support" }),
  supportNeeded: z.enum(SUPPORT_OPTIONS, { message: "Please select the support you need" }),
  description,
  preferredContact: z.enum(CONTACT_METHODS, {
    message: "Please choose a preferred contact method",
  }),
  website: honeypot,
});

export const volunteerSchema = z.object({
  name: fullName,
  email,
  phone,
  city,
  profession: z.string().trim().max(100).optional().or(z.literal("")),
  skills: z
    .string()
    .trim()
    .min(3, { message: "Tell us about your skills or expertise" })
    .max(300, { message: "Please keep this under 300 characters" }),
  availability: z.enum(AVAILABILITY, { message: "Please select your availability" }),
  reason: description,
  website: honeypot,
});

export const contactSchema = z.object({
  name: fullName,
  email,
  subject: z
    .string()
    .trim()
    .min(3, { message: "Please add a subject" })
    .max(150, { message: "Please keep the subject under 150 characters" }),
  message: description,
  website: honeypot,
});

export type PatientInput = z.infer<typeof patientSchema>;
export type VolunteerInput = z.infer<typeof volunteerSchema>;
export type ContactInput = z.infer<typeof contactSchema>;

export const schemaByKind = {
  patient: patientSchema,
  volunteer: volunteerSchema,
  contact: contactSchema,
} as const;

export type SubmissionKind = keyof typeof schemaByKind;
