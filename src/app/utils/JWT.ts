// import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';

// const generateToken = (payload: object, secret: Secret, expiresIn: string) => {
//     const token = jwt.sign(payload, secret, {
//         algorithm: 'HS256',
//         expiresIn: expiresIn,
//     } as SignOptions);

//     return token;
// };

// const verifyToken = (token: string, secret: Secret): JwtPayload => {
//     return jwt.verify(token, secret) as JwtPayload;
// };

// export const jwtHelpers = {
//     generateToken,
//     verifyToken,
// };
// export type JwtPayloadType = JwtPayload & {
//     email: string;
//     role: string;
//     iat: number;
//     exp: number;
// };
// export type JwtTokenType = string | JwtPayloadType | null;

import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";
import { configs } from "../configs"; // adjust path if needed

// Generate JWT token safely
const generateToken = (payload: object, secret: Secret, expiresIn: string) => {
  if (!secret || typeof secret !== "string" || secret.trim() === "") {
    throw new Error(
      "JWT secret is missing! Check your .env file and configs.jwt.access_token or refresh_token"
    );
  }

  return jwt.sign(payload, secret, {
    algorithm: "HS256",
    expiresIn,
  } as SignOptions);
};

// Verify JWT token safely
const verifyToken = (token: string, secret: Secret): JwtPayload => {
  if (!secret || typeof secret !== "string" || secret.trim() === "") {
    throw new Error(
      "JWT secret is missing for verification! Check your .env file and configs.jwt.access_token or refresh_token"
    );
  }

  return jwt.verify(token, secret) as JwtPayload;
};

export const jwtHelpers = {
  generateToken,
  verifyToken,
};

// JWT Payload type for TypeScript
export type JwtPayloadType = JwtPayload & {
  email: string;
  role: string;
  iat: number;
  exp: number;
};

// Union type for token
export type JwtTokenType = string | JwtPayloadType | null;
