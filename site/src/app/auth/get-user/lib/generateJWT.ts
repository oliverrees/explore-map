import jwt from "jsonwebtoken";

export function generateJWT(strava_id: string): string {
  const payload = {
    strava_id: strava_id,
  };

  // Secret key: This should be kept secret (store it in an environment variable).
  const secretKey = process.env.JWT_SECRET as string;

  // Options: Expiration time, algorithm, etc.
  const options: jwt.SignOptions = {
    expiresIn: "7d", // Token will expire in 7 days
  };

  // Generate the token
  const token = jwt.sign(payload, secretKey, options);
  return token;
}
