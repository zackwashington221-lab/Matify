import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { User } from "../models/index.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/error.js";
import { audit, crudRouter } from "../utils/crud.js";
import { sendTeamInvite } from "../services/mailer.js";

const router = Router();
const managers = [requireAuth, requireRole("Owner", "Admin")];

const adminCredentials = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

router.post("/admins", ...managers, asyncHandler(async (req, res) => {
  const { email, password } = adminCredentials.parse(req.body);
  const normalizedEmail = email.toLowerCase();
  if (await User.findOne({ email: normalizedEmail })) {
    return res.status(409).json({ error: "A user with this email already exists" });
  }

  const user = await User.create({
    name: normalizedEmail.split("@")[0],
    email: normalizedEmail,
    passwordHash: await bcrypt.hash(password, 10),
    role: "Admin",
    status: "active",
  });
  await audit(req, "admin.created", user);
  res.status(201).json({ data: user });
}));

router.post("/invite", ...managers, asyncHandler(async (req, res) => {
  const { email, role = "Support", name } = req.body;
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) return res.status(422).json({ error: "A valid work email is required" });
  if (await User.findOne({ email: email.toLowerCase() })) return res.status(409).json({ error: "A user with this email already exists" });
  const inviteUrl = `${process.env.ADMIN_APP_URL || "http://localhost:3000"}/admin-login?invite=${encodeURIComponent(email.toLowerCase())}`;
  let delivery;
  try {
    delivery = await sendTeamInvite({ email: email.toLowerCase(), role, inviteUrl });
  } catch (error) {
    return res.status(error.status || 502).json({ error: error.message || "Invite email could not be sent" });
  }
  const user = await User.create({ name: name || email.split("@")[0], email: email.toLowerCase(), role, status: "invited", passwordHash: await bcrypt.hash(`invite-${crypto.randomUUID()}`, 10) });
  await audit(req, "member.invited", user);
  res.status(201).json({ data: user, delivery });
}));

router.use("/", crudRouter(User, { searchFields: ["name", "email"], filterFields: ["role", "status"], writeGuard: managers, resourceName: "member" }));
export default router;
