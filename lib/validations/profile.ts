import { z } from "zod";

export const personalProfileSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required."),
  lastName: z.string().trim().min(1, "Last name is required."),
  username: z.string().trim().min(3, "Username must be at least 3 characters."),
  email: z.email("Enter a valid email address."),
  phoneNumber: z
    .string()
    .trim()
    .min(9, "Phone number must be at least 9 digits.")
    .max(11, "Phone number is too long."),
  profile: z.string().optional().default(""),
});

export const organizerProfileSchema = z.object({
  orgName: z.string().trim().min(2, "Organization name is required."),
  orgBio: z.string().trim().min(20, "Organization bio must be at least 20 characters."),
  orgProfilePath: z.string().trim().min(1, "Please upload an organization profile image."),
});

export type PersonalProfileInput = z.infer<typeof personalProfileSchema>;
export type OrganizerProfileInput = z.infer<typeof organizerProfileSchema>;
