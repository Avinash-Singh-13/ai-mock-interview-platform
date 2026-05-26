import { NextRequest } from "next/server";
import { fallbackQuestion, generateQuestion } from "@/lib/ai";
import { fail, ok, parseJson } from "@/lib/api";
import { verifyRequest } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Interview } from "@/models/Interview";

type Body = { category: "DSA" | "Frontend" | "Backend"; difficulty: "Easy" | "Medium" | "Hard" };

export async function POST(req: NextRequest) {
  const user = verifyRequest(req);
  if (!user) return fail("Not authenticated.", 401);
  const body = await parseJson<Body>(req);
  if (!body?.category || !body.difficulty) return fail("Category and difficulty are required.");

  await connectDB();
  let question = fallbackQuestion;
  try {
    question = await generateQuestion(body.category, body.difficulty);
  } catch {
    question = fallbackQuestion;
  }
  const interview = await Interview.create({
    candidateId: user.id,
    category: body.category,
    difficulty: body.difficulty,
    question,
    code: question.starterCode || ""
  });
  return ok({ interview: serialize(interview) }, 201);
}

export async function GET(req: NextRequest) {
  const user = verifyRequest(req);
  if (!user) return fail("Not authenticated.", 401);
  await connectDB();
  const query = user.role === "candidate" ? { candidateId: user.id } : {};
  const interviews = await Interview.find(query).sort({ createdAt: -1 }).limit(20).lean();
  return ok({ interviews: interviews.map(serialize) });
}

function serialize(doc: any) {
  return {
    id: doc._id?.toString(),
    category: doc.category,
    difficulty: doc.difficulty,
    status: doc.status,
    question: doc.question,
    code: doc.code,
    language: doc.language,
    feedback: doc.feedback,
    createdAt: doc.createdAt,
    submittedAt: doc.submittedAt
  };
}
