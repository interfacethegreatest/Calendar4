import type { NextApiRequest, NextApiResponse } from "next";     // ✅ change to your actual connect file
import connectDB from "@/utils/connectDB";
import User from "@/models/User";          // ✅ change to your actual User model file


type PersonSuggestion = {
  id: string;
  name: string;
  subtitle?: string; // email
};

function escapeRegex(input: string) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PersonSuggestion[] | { error: string }>
) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
  if (!q) return res.status(200).json([]);

  const rx = new RegExp("^" + escapeRegex(q), "i"); // prefix autocomplete

  await connectDB();

  const users = await User.find(
    { $or: [{ name: { $regex: rx } }, { email: { $regex: rx } }] },
    { _id: 1, name: 1, email: 1 }
  )
    .limit(8)
    .lean();

  return res.status(200).json(
    users.map((u: any) => ({
      id: String(u._id),
      name: u.name ?? "(no name)",
      subtitle: u.email,
    }))
  );
}
