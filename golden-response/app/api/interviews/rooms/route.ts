import { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api";
import { verifyRequest } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Interview } from "@/models/Interview";

export async function GET(req: NextRequest) {
  const user = verifyRequest(req);
  if (!user) return fail("Not authenticated.", 401);
  await connectDB();
  const active = await Interview.find({ status: "active" }).sort({ createdAt: -1 }).limit(12).populate("candidateId", "name email").lean();
  return ok({
    rooms: active.map((item: any) => ({
      id: item._id.toString(),
      candidate: item.candidateId?.name || "Candidate",
      email: item.candidateId?.email,
      category: item.category,
      difficulty: item.difficulty,
      createdAt: item.createdAt
    }))
  });
}
