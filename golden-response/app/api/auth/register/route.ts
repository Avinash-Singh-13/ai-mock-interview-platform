import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { comparePassword, hashPassword, setAuthCookie, signToken } from "@/lib/auth";
import { fail, ok, parseJson } from "@/lib/api";
import { User } from "@/models/User";

type Body = { name: string; email: string; password: string; role?: "candidate" | "interviewer" };

export async function POST(req: NextRequest) {
  const body = await parseJson<Body>(req);
  if (!body?.name || !body.email || !body.password) return fail("Name, email, and password are required.");
  if (body.password.length < 8) return fail("Password must be at least 8 characters.");

  await connectDB();
  const existing = await User.findOne({ email: body.email.toLowerCase() });
  if (existing && (await comparePassword(body.password, existing.passwordHash))) {
    const user = { id: existing._id.toString(), name: existing.name, email: existing.email, role: existing.role };
    await setAuthCookie(signToken(user));
    return ok({ user });
  }
  if (existing) return fail("An account with this email already exists.", 409);

  const created = await User.create({
    name: body.name,
    email: body.email.toLowerCase(),
    passwordHash: await hashPassword(body.password),
    role: body.role || "candidate"
  });
  const user = { id: created._id.toString(), name: created.name, email: created.email, role: created.role };
  await setAuthCookie(signToken(user));
  return ok({ user }, 201);
}
