import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function validateConfig() {
  if (!process.env.RESEND_API_KEY) {
    const error = new Error(
      "Email delivery is not configured. Set RESEND_API_KEY in server/.env."
    );
    error.status = 503;
    throw error;
  }
}

export async function sendTeamInvite({
  email,
  role,
  inviteUrl,
}) {
  validateConfig();

  const from =
    process.env.RESEND_FROM ||
    "Martify Admin <onboarding@resend.dev>";

  const { data, error } = await resend.emails.send({
    from,
    to: email,
    subject: "You're invited to Martify Admin",
    text: `
You have been invited to Martify Admin as ${role}.

Complete your account setup:
${inviteUrl}
    `,
    html: `
      <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:auto">
        <h1 style="color:#15803d">
          Welcome to Martify Admin
        </h1>

        <p>
          You have been invited to join the
          <strong>Martify Admin Console</strong>
          as <strong>${role}</strong>.
        </p>

        <a
          href="${inviteUrl}"
          style="
            display:inline-block;
            background:#15803d;
            color:#ffffff;
            padding:12px 18px;
            border-radius:8px;
            text-decoration:none;
            font-weight:600;
          "
        >
          Complete account setup
        </a>

        <p style="margin-top:24px;color:#64748b;font-size:13px">
          This invitation is intended for
          ${email}.
        </p>
      </div>
    `,
  });

  if (error) {
    console.error("Resend Error:", error);

    const err = new Error(error.message);
    err.status = 500;
    throw err;
  }

  return {
    success: true,
    id: data?.id,
  };
}
