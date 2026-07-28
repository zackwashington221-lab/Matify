import nodemailer from "nodemailer";

async function transporter() {
  // Development/test mode always uses Ethereal. Messages are captured in a
  // disposable inbox and never delivered to the invited person's real mailbox.
  if (process.env.SMTP_TEST_MODE !== "false") {
    const account = await nodemailer.createTestAccount();
    return { transporter: nodemailer.createTransport({ host: account.smtp.host, port: account.smtp.port, secure: account.smtp.secure, auth: { user: account.user, pass: account.pass } }), testMode: true };
  }
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    const error = new Error("Email delivery is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER and SMTP_PASS in server/.env.");
    error.status = 503;
    throw error;
  }
  return { transporter: nodemailer.createTransport({ host: SMTP_HOST, port: Number(SMTP_PORT) || 587, secure: process.env.SMTP_SECURE === "true", auth: { user: SMTP_USER, pass: SMTP_PASS } }), testMode: false };
}

export async function sendTeamInvite({ email, role, inviteUrl }) {
  const from = process.env.SMTP_FROM || "Freshly Admin <no-reply@freshly.local>";
  const delivery = await transporter();
  const info = await delivery.transporter.sendMail({
    from,
    to: email,
    subject: "You’re invited to Freshly Admin",
    text: `You have been invited to Freshly Admin as ${role}. Open ${inviteUrl} to complete your account setup.`,
    html: `<div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:auto"><h1 style="color:#15803d">Welcome to Freshly Admin</h1><p>You have been invited to join the Freshly Admin Console as <strong>${role}</strong>.</p><p><a href="${inviteUrl}" style="display:inline-block;background:#15803d;color:#fff;padding:12px 18px;border-radius:8px;text-decoration:none;font-weight:600">Complete account setup</a></p><p style="color:#64748b;font-size:13px">This invitation is intended for ${email}.</p></div>`,
  });
  const previewUrl = delivery.testMode ? nodemailer.getTestMessageUrl(info) : null;
  if (previewUrl) console.info(`[mail] test invite preview: ${previewUrl}`);
  return { testMode: delivery.testMode, previewUrl };
}
