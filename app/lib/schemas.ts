import * as z from "zod";

// validates signup data
export const SignupFormSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email." })
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(8, { message: "Be at least 8 characters long" })
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Contain at least one special character.",
    })
    .trim(),
});

// validates login data
export const LoginFormSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email." })
    .trim()
    .toLowerCase(),
  password: z.string().min(1, { message: "Password is required." }),
});

// validates recovery data
export const RecoveryFormSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email." })
    .trim()
    .toLowerCase(),
  recoveryCode: z
    .string()
    .min(1, { message: "Recovery code is required." })
    .trim()
    .transform((val) => val.toUpperCase()),
  newPassword: z
    .string()
    .min(8, { message: "Be at least 8 characters long" })
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Contain at least one special character.",
    })
    .trim(),
});
