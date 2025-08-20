import crypto from "crypto";

// 1️⃣ Generate a random salt
export const generateSalt = (length = 16) => {
  return crypto.randomBytes(length).toString("hex");
};

// 2️⃣ Hash a password with a given salt
export const hashpassword = (password: string, salt: string) => {
  const hashed = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512");
  return hashed.toString("hex");
};

// 3️⃣ Compare a plain password with a hashed one
export const comparePasswords = (
  password: string,
  hashedPassword: string,
  salt: string
) => {
  const hashedAttempt = Buffer.from(hashpassword(password, salt), "hex");
  const hashedBuffer = Buffer.from(hashedPassword, "hex");

  // Use timingSafeEqual for constant-time comparison
  if (hashedAttempt.length !== hashedBuffer.length) return false;
  return crypto.timingSafeEqual(hashedAttempt, hashedBuffer);
};
