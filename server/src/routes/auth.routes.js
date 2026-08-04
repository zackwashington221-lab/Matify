import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { User, Customer } from "../models/index.js";
import { signToken, requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/error.js";

const router = Router();

const credentials = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2).optional(),
});

const signUp = asyncHandler(async (req, res) => {
  const { email, password, name } = credentials.parse(req.body);
  const normalizedEmail = email.toLowerCase();
  if (await User.findOne({ email: normalizedEmail })) {
    return res.status(409).json({ error: "Email already registered" });
  }

  const user = await User.create({
    email: normalizedEmail,
    name: name || normalizedEmail.split("@")[0],
    passwordHash: await bcrypt.hash(password, 10),
    role: "Customer",
  });
  await Customer.findOneAndUpdate(
    { email: normalizedEmail },
    { email: normalizedEmail, name: user.name, user: user._id },
    { upsert: true, setDefaultsOnInsert: true },
  );

  res.status(201).json({ token: signToken(user), user: publicUser(user) });
});

router.post("/signup", signUp);
// Keep the original endpoint available for existing web and mobile clients.
router.post("/register", signUp);

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = credentials.parse(req.body);
    const user = await User.findOne({ email: email.toLowerCase() }).select("+passwordHash");
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    if (user.status === "suspended") return res.status(403).json({ error: "Account suspended" });

    user.lastActiveAt = new Date();
    await user.save();
    res.json({ token: signToken(user), user: publicUser(user) });
  })
);

router.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => res.json({ user: publicUser(req.user) }))
);

router.patch(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { name, avatarUrl } = req.body;
    if (name) req.user.name = name;
    if (avatarUrl) req.user.avatarUrl = avatarUrl;
    await req.user.save();
    res.json({ user: publicUser(req.user) });
  })
);

router.post(
  "/change-password",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select("+passwordHash");
    if (!(await bcrypt.compare(currentPassword || "", user.passwordHash))) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }
    if (!newPassword || newPassword.length < 8) return res.status(422).json({ error: "New password too short" });
    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ ok: true });
  })
);

// JWTs are stateless; clients clear their persisted token after this acknowledgement.
// This endpoint keeps the mobile logout flow explicit and leaves room for token revocation later.
router.post("/logout", requireAuth, asyncHandler(async (_req, res) => {
  res.status(204).send();
}));

function publicUser(u) {
  return { id: u._id, name: u.name, email: u.email, role: u.role, avatarUrl: u.avatarUrl, mfaEnabled: u.mfaEnabled };
}

export default router;
