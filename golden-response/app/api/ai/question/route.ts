import { NextRequest } from "next/server";
import { generateQuestion } from "@/lib/ai";
import { fail, ok, parseJson } from "@/lib/api";
import { verifyRequest } from "@/lib/auth";

type Body = { category: string; difficulty: string };

export async function POST(req: NextRequest) {
  const user = verifyRequest(req);
  if (!user) return fail("Not authenticated.", 401);
  const body = await parseJson<Body>(req);
  if (!body?.category || !body.difficulty) return fail("Category and difficulty are required.");
  try {
    return ok({ question: await generateQuestion(body.category, body.difficulty) });
  } catch (error) {
    return fail("AI question generation failed. Try again or use the fallback prompt.", 502, error instanceof Error ? error.message : error);
  }
}
