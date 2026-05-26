import { NextRequest } from "next/server";
import { comparePassword, setAuthCookie, signToken, clearAuthCookie } from "@/lib/auth";
import { fail, ok, parseJson } from "@/lib/api";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";

type Body = { email: string; password: string };

export async function POST(req: NextRequest) {
  const body = await parseJson<Body>(req);
  if (!body?.email || !body.password) return fail("Email and password are required.");
  await connectDB();
  const userDoc = await User.findOne({ email: body.email.toLowerCase() });
  if (!userDoc || !(await comparePassword(body.password, userDoc.passwordHash))) return fail("Invalid email or password.", 401);
  const user = { id: userDoc._id.toString(), name: userDoc.name, email: userDoc.email, role: userDoc.role };
  await setAuthCookie(signToken(user));
  return ok({ user });
}

export async function DELETE() {
  await clearAuthCookie();
  return ok({ loggedOut: true });
}
