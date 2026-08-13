import * as z from "zod";

export const LoginSchema = z.object({
  email: z
    .string({ error: "Email is required" })
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address"),

  password: z
    .string({ error: "Password is required" })
    .min(3, "Password must be at least 3 characters"),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
  name: z
    .string()
    .min(4, "Name must be at least 3 characters")
    .max(30, "Name must be smaller than 20 characters"),
  email: z
    .string({ error: "Email is required" })
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address"),
  password: z
    .string({ error: "Password is required" })
    .min(3, "Password must be at least 3 characters"),
});

export const addPayloadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name cannot exceed 100 characters"),

  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(600, "Description cannot exceed 600 characters"),

  price: z
    .number({
      error: "Price must be a number",
    })
    .positive("Price must be greater than 0"),

  features: z
    .array(z.string().trim().min(1, "Feature cannot be empty"))
    .min(1, "At least one feature is required"),

  technicalData: z
    .array(z.string().trim().min(1, "Technical data cannot be empty"))
    .min(1, "At least one technical data is required"),

  bracelet: z
    .array(z.string().trim().min(1, "Bracelet value cannot be empty"))
    .min(1, "At least one bracelet value is required"),

  pictures: z
    .array(z.string().trim())
    .min(1, "At least one picture is required"),

  tag: z
    .string()
    .trim()
    .min(1, "Tag is required")
    .max(50, "Tag cannot exceed 50 characters"),
});

export const updatePayloadSchema = addPayloadSchema.partial();
