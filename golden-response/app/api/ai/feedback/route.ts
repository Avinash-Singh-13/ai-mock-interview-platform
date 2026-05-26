import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { generateFeedback } from "@/lib/ai";
import { fail, ok, parseJson } from "@/lib/api";
import { verifyRequest } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Interview } from "@/models/Interview";

type Body = { interviewId: string; code: string; language?: string };

export async function POST(req: NextRequest) {
  const user = verifyRequest(req);
  if (!user) return fail("Not authenticated.", 401);
  const body = await parseJson<Body>(req);
  if (!body?.interviewId) return fail("Interview id is required.");
  if (!mongoose.isValidObjectId(body.interviewId)) return fail("Invalid interview session.", 400);
  if (!body.code?.trim()) return fail("Submit code before requesting feedback.");

  await connectDB();
  const interview = await Interview.findById(body.interviewId);
  if (!interview) return fail("Interview session was not found.", 404);
  let feedback;
  try {
    feedback = await generateFeedback({
      question: interview.question?.prompt || interview.question?.title || "Interview problem",
      code: body.code,
      notes: interview.notes?.map((n: { text: string }) => n.text),
      category: interview.category,
      difficulty: interview.difficulty
    });
  } catch {
    feedback = {
      summary: "AI feedback is temporarily unavailable, but your solution was saved for later review.",
      strengths: ["Submission saved successfully"],
      improvements: ["Retry feedback generation after checking the AI API configuration."],
      complexity: "Pending",
      score: null
    };
  }
  interview.code = body.code;
  interview.language = body.language || interview.language;
  interview.feedback = feedback;
  interview.status = "submitted";
  interview.submittedAt = new Date();
  await interview.save();
  return ok({ feedback });
}
