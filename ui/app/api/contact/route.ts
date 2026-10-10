import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

const RECIPIENTS = [
  "trongtrawork@gmail.com",
  "nguyenthithanhchau2004@gmail.com",
  "toro.org.work@gmail.com",
];

export async function POST(request: Request) {
  try {
    const { name, email, company, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: "TORO Contact <contact@toro.com.vn>",
      to: RECIPIENTS,
      subject: `Partner inquiry from ${name}`,
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #0a1628; margin-bottom: 8px;">New partner inquiry</h2>
          <p style="color: #666; margin-bottom: 24px;">Received via toro.com.vn contact form</p>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #888; width: 120px;">Name</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #0a1628; font-weight: 600;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #888;">Email</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #0a1628;">${email}</td>
            </tr>
            ${
              company
                ? `<tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #888;">Company</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #0a1628;">${company}</td>
                </tr>`
                : ""
            }
            <tr>
              <td style="padding: 12px 0; color: #888; vertical-align: top;">Message</td>
              <td style="padding: 12px 0; color: #0a1628; white-space: pre-wrap;">${message}</td>
            </tr>
          </table>
        </div>
      `,
    });

    if (error) {
      // The Resend SDK does NOT throw on API errors (e.g. unverified domain,
      // bad key, invalid from) — it returns { data, error }.
      console.error("Resend send failed:", error);
      return NextResponse.json(
        { error: "Failed to send message" },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
