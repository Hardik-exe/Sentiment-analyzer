import bcrypt from "bcryptjs";

/**
 * No database in this build (by design — see project README).
 * Credentials are a single operator account defined via environment
 * variables, with the password stored as a bcrypt hash rather than
 * plaintext. This is intentionally simple but not naive: swapping in
 * a real users table later only means replacing this one function.
 */
export async function verifyCredentials(
  username: string,
  password: string
): Promise<boolean> {
  const expectedUsername = process.env.AUTH_USERNAME;
  const expectedPasswordHash = process.env.AUTH_PASSWORD_HASH;

  if (!expectedUsername || !expectedPasswordHash) {
    throw new Error(
      "AUTH_USERNAME and AUTH_PASSWORD_HASH must be set in environment variables."
    );
  }

  if (username !== expectedUsername) {
    // Still run a bcrypt compare against a dummy hash so that
    // response timing doesn't reveal whether the username was correct.
    await bcrypt.compare(password, expectedPasswordHash);
    return false;
  }

  return bcrypt.compare(password, expectedPasswordHash);
}
