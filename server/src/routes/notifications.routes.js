import { Router } from "express";
import { Customer, DeviceToken, Notification, UserNotification } from "../models/index.js";
import { asyncHandler } from "../middleware/error.js";
import { requireAdmin, requireAuth, requireWriteAdmin } from "../middleware/auth.js";
import { audit, crudRouter } from "../utils/crud.js";

const router = Router();

router.post("/device-token", requireAuth, asyncHandler(async (req, res) => {
  const { token, platform = "web" } = req.body;
  if (!token || typeof token !== "string") return res.status(422).json({ error: "A device token is required" });
  await DeviceToken.findOneAndUpdate({ token }, { user: req.user._id, token, platform, active: true, lastSeenAt: new Date() }, { upsert: true, new: true });
  res.status(201).json({ ok: true });
}));

router.get("/mine", requireAuth, asyncHandler(async (req, res) => {
  const data = await UserNotification.find({ user: req.user._id }).sort("-createdAt").limit(100);
  res.json({ data, unread: data.filter((notification) => !notification.readAt).length });
}));

router.patch("/mine/:id/read", requireAuth, asyncHandler(async (req, res) => {
  const notification = await UserNotification.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { readAt: new Date() }, { new: true });
  if (!notification) return res.status(404).json({ error: "Notification not found" });
  res.json({ data: notification });
}));

router.post("/:id/send", requireWriteAdmin, asyncHandler(async (req, res) => {
  const campaign = await Notification.findById(req.params.id);
  if (!campaign) return res.status(404).json({ error: "Notification campaign not found" });
  const customers = await Customer.find({ user: { $exists: true, $ne: null } }).select("user");
  const recipients = customers.map((customer) => ({ user: customer.user, campaign: campaign._id, title: campaign.title, body: campaign.body, category: campaign.category, channel: "inapp" }));
  if (recipients.length) await UserNotification.insertMany(recipients);
  campaign.status = "sent";
  campaign.sentAt = new Date();
  campaign.stats = { delivered: recipients.length, opened: 0, clicked: 0 };
  await campaign.save();
  await audit(req, "notification.sent", campaign);
  res.json({ data: campaign, delivered: recipients.length });
}));

router.use("/", crudRouter(Notification, { searchFields: ["title", "body"], filterFields: ["status", "channel", "category"], resourceName: "notification" }));

export default router;
