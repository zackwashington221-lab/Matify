import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

export function signToken(user) {
  return jwt.sign({ sub: String(user._id), role: user.role, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: "Missing bearer token" });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub);
    if (!user || user.status === "suspended") return res.status(401).json({ error: "Invalid session" });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

export const ADMIN_ROLES = ["Owner", "Admin", "Ops Manager", "Support", "Analyst", "Read only"];

export function requireRole(...allowed) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "Unauthenticated" });
    if (!allowed.includes(req.user.role)) return res.status(403).json({ error: "Forbidden" });
    next();
  };
}

export const requireAdmin = [requireAuth, requireRole(...ADMIN_ROLES)];
export const requireWriteAdmin = [requireAuth, requireRole("Owner", "Admin", "Ops Manager")];
