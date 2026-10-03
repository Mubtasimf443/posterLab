/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import z from "zod";
export const registrationSchema = z.object({
  name: z
    .string()
    .min(4, "Name must be at least 4 characters")
    .max(255, "Name must be at most 120 characters"),

  email: z
    .string()
    .email("Please enter a valid email address")
    .min(7, "Email must be at least 7 characters")
    .max(255, "Email must be at most 255 characters")
    .transform(str => str.toLowerCase()),

  password: z
    .string()
    .min(7, "Password must be at least 7 characters")
    .max(120, "Password must be at most 120 characters"),
});

export const verificationTokenSchema = z.string().regex(/^[0-9a-fA-F]{96}$/, { message : 'token must be 96 cherecter Long hex string'});

export const loginSchema = z.object({
  email: z.string()
    .email("Please enter a valid email address")
    .min(7, "Email must be at least 7 characters")
    .max(255, "Email must be at most 255 characters")
    .transform(str => str.toLowerCase()),
  password: z
    .string()
    .min(7, "Password must be at least 7 characters")
    .max(120, "Password must be at most 120 characters"),
})