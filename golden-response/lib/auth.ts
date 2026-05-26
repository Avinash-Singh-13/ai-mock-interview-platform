import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "candidate" | "interviewer";
};

const cookieName = "mock_interview_token";

function secret() {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not configured");
  return process.env.JWT_SECRET;
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signToken(user: AuthUser) {
  return jwt.sign(user, secret(), { expiresIn: "7d" });
}

export async function setAuthCookie(token: string) {
  const jar = await cookies();
  jar.set(cookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/"
  });
}

export async function clearAuthCookie() {
  const jar = await cookies();
  jar.delete(cookieName);
}

export function verifyRequest(req: NextRequest): AuthUser | null {
  const token = req.cookies.get(cookieName)?.value || req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return null;
  try {
    return jwt.verify(token, secret()) as AuthUser;
  } catch {
    return null;
  }
}
