"use server";

// #region | imports
import { cookies } from "next/headers";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { query } from "@/app/lib/db";
import {
  SignupFormSchema,
  LoginFormSchema,
  RecoveryFormSchema,
} from "@/app/lib/schemas";
import { FormState } from "@/app/lib/data";
// #endregion

// #region | generates recovery code
function generateRecoveryCode(): string {
  return (
    crypto
      .randomBytes(6)
      .toString("hex")
      .toUpperCase()
      .match(/.{1,4}/g)
      ?.join("-") || ""
  );
}

// #endregion

// #region | creates a session for the user
async function registerUserSession(userId: number) {
  const sessionId = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await query(
    `UPDATE users 
     SET session_token = $1, session_expires_at = $2 
     WHERE id = $3`,
    [sessionId, expiresAt, userId],
  );

  const cookieStore = await cookies();
  cookieStore.set("session_id", sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

// #endregion

// #region | retrieves users session
export async function getSessionUser() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value;

  if (!sessionId) {
    return null;
  }

  try {
    const res = await query(
      `SELECT id, email 
       FROM users 
       WHERE session_token = $1 
         AND session_expires_at > NOW()`,
      [sessionId],
    );

    if (res.rows.length === 0) {
      return null;
    }

    return res.rows[0] as { id: number; email: string };
  } catch (error: any) {
    console.error("Session verification failed:", error);
    return null;
  }
}

// #endregion

// #region | creates user upon signup
export async function signupAction(
  state: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const validatedFields = SignupFormSchema.safeParse({ email, password });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email: validEmail, password: validPassword } = validatedFields.data;
  const recoveryCode = generateRecoveryCode();

  try {
    const existingUser = await query("SELECT id FROM users WHERE email = $1", [
      validEmail,
    ]);
    if (existingUser.rows.length > 0) {
      return {
        errors: { email: ["An account with this email already exists."] },
      };
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(validPassword, saltRounds);

    const insertRes = await query(
      `INSERT INTO users (email, password_hash, recovery_code) 
       VALUES ($1, $2, $3) 
       RETURNING id`,
      [validEmail, passwordHash, recoveryCode],
    );

    const newUser = insertRes.rows[0] as { id: number } | undefined;

    if (!newUser) {
      return { message: "Account creation failed. Please try again." };
    }

    await query(`INSERT INTO user_settings (user_id) VALUES ($1)`, [
      newUser.id,
    ]);
    await registerUserSession(newUser.id);
  } catch (error: any) {
    console.error("Sign up error detailed:", error);
    // return { message: `Signup Error: ${error.message || error}` }; // Temporary troubleshooting message
    return { message: "An unexpected error occurred. Please try again." };
  }

  return {
    recoveryCodeToShow: recoveryCode,
  };
}

// #endregion

// #region | logs a user into their account
export async function loginAction(
  state: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const validatedFields = LoginFormSchema.safeParse({ email, password });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email: validEmail, password: validPassword } = validatedFields.data;

  try {
    const userRes = await query("SELECT * FROM users WHERE email = $1", [
      validEmail,
    ]);
    const user = userRes.rows[0];

    if (!user) {
      return { message: "Invalid email or password." };
    }

    const isPasswordCorrect = await bcrypt.compare(
      validPassword,
      user.password_hash,
    );
    if (!isPasswordCorrect) {
      return { message: "Invalid email or password." };
    }

    await registerUserSession(user.id);
  } catch (error: any) {
    console.error("Login error detailed:", error);
    // return { message: `Login Error: ${error.message || error}` }; // Temporary troubleshooting message
    return { message: "An unexpected error occurred. Please try again." };
  }

  redirect("/");
}

// #endregion

// #region | logs a user out
// needs a method to actually allow a user to logout in app
export async function logoutAction() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value;

  if (sessionId) {
    await query(
      `UPDATE users 
       SET session_token = NULL, session_expires_at = NULL 
       WHERE session_token = $1`,
      [sessionId],
    );
  }

  cookieStore.delete("session_id");
  redirect("/login");
}
// #endregion

// #region | recovery code login/reset password
export async function recoverPasswordAction(
  state: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = formData.get("email") as string;
  const recoveryCode = formData.get("recoveryCode") as string;
  const newPassword = formData.get("newPassword") as string;

  const validatedFields = RecoveryFormSchema.safeParse({
    email,
    recoveryCode,
    newPassword,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const {
    email: validEmail,
    recoveryCode: validCode,
    newPassword: validPassword,
  } = validatedFields.data;
  const newRecoveryCode = generateRecoveryCode();

  try {
    const userRes = await query(
      `SELECT id FROM users WHERE email = $1 AND recovery_code = $2`,
      [validEmail, validCode],
    );
    const user = userRes.rows[0];

    if (!user) {
      return { message: "Invalid email or recovery code." };
    }

    const saltRounds = 10;
    const newPasswordHash = await bcrypt.hash(validPassword, saltRounds);

    await query(
      `UPDATE users 
       SET password_hash = $1, 
           recovery_code = $2, 
           session_token = NULL, 
           session_expires_at = NULL 
       WHERE id = $3`,
      [newPasswordHash, newRecoveryCode, user.id],
    );
  } catch (error: any) {
    console.error("Recovery error detailed:", error);
    // return { message: `Recovery Error: ${error.message || error}` }; // Temporary troubleshooting message
    return { message: "An unexpected error occurred. Please try again." };
  }

  return {
    newRecoveryCodeToShow: newRecoveryCode,
  };
}

// #endregion
