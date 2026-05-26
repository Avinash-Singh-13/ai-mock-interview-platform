import { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api";
import { verifyRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = verifyRequest(req);
  if (!user) return fail("Not authenticated.", 401);
  return ok({ user });
}
