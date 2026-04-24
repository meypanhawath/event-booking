import { z } from "zod";

export const organizerStep1Schema = z.object({
  orgName: z.string().min(1, "Organization name is required").max(100, "Too long"),
  orgBio: z.string().max(500, "Bio must be under 500 characters").optional(),
});

export const organizerStep2Schema = z.object({
  bankName: z.string().min(1, "Bank name is required").max(100, "Too long"),
  bankAccountNumber: z
    .string()
    .min(1, "Account number is required")
    .regex(/^[0-9]{9,10}$/, "Account number must be 9-10 digits"),
  bankAccountName: z.string().min(1, "Account holder name is required").max(100, "Too long"),
  currency: z.enum(["KHR", "USD"], { message: "Please select a currency" }),
});

export const organizerApplicationSchema = organizerStep1Schema.merge(organizerStep2Schema);

export type OrganizerStep1Data = z.infer<typeof organizerStep1Schema>;
export type OrganizerStep2Data = z.infer<typeof organizerStep2Schema>;
export type OrganizerApplicationData = z.infer<typeof organizerApplicationSchema>;
