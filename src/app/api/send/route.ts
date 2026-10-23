import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contact } from "@/data/content";

/**
 * In-Memory Sliding-Window Rate Limiter
 * Limits requests per client IP (max 5 dispatches per 10 minutes)
 * to prevent abuse and protect monthly email quota.
 */
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const timestamps = rateLimitMap.get(ip) || [];

  const recent = timestamps.filter((t) => t > windowStart);

  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    rateLimitMap.set(ip, recent);
    return true;
  }

  recent.push(now);
  rateLimitMap.set(ip, recent);

  // Periodic cleanup if map grows
  if (rateLimitMap.size > 500) {
    for (const [key, times] of rateLimitMap.entries()) {
      const active = times.filter((t) => t > windowStart);
      if (active.length === 0) rateLimitMap.delete(key);
      else rateLimitMap.set(key, active);
    }
  }

  return false;
}

function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return req.headers.get("x-real-ip") || "127.0.0.1";
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    // 1. IP-based Rate Limiting
    const clientIp = getClientIp(req);
    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        { error: "Too many letters dispatched. Please wait a few minutes before sending another." },
        { status: 429 }
      );
    }

    // 2. Secret Verification
    const apiKey = process.env.RESEND_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json(
        { error: "Server email service is not configured" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { fromEmail, topic, message, fullName, website } = body;

    // 3. Honeypot Anti-Bot Shield (if hidden bot field is filled, silently fake success)
    if (website && typeof website === "string" && website.trim().length > 0) {
      return NextResponse.json({ success: true, data: { id: "hp_filtered" } });
    }

    // 4. Required Fields Check
    if (!fromEmail || !topic || !message || !fullName) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const cleanEmail = String(fromEmail).trim();
    const cleanTopic = String(topic).trim();
    const cleanMessage = String(message).trim();
    const cleanName = String(fullName).trim();

    // 5. Strict Payload & Length Validation
    if (!EMAIL_REGEX.test(cleanEmail) || cleanEmail.length > 100) {
      return NextResponse.json(
        { error: "Please enter a valid email address (up to 100 characters)" },
        { status: 400 }
      );
    }

    if (cleanTopic.length < 2 || cleanTopic.length > 120) {
      return NextResponse.json(
        { error: "Subject must be between 2 and 120 characters" },
        { status: 400 }
      );
    }

    if (cleanName.length < 2 || cleanName.length > 80) {
      return NextResponse.json(
        { error: "Name must be between 2 and 80 characters" },
        { status: 400 }
      );
    }

    if (cleanMessage.length < 2 || cleanMessage.length > 3000) {
      return NextResponse.json(
        { error: "Message must be between 2 and 3,000 characters" },
        { status: 400 }
      );
    }

    const recipient = process.env.CONTACT_RECEIVER_EMAIL?.trim() || contact.email || "deghneagana@gmail.com";
    const resend = new Resend(apiKey);

    // 6. Plaintext content
    const textContent = `${cleanMessage}

Best Regards,
${cleanName}
From: ${cleanEmail}`;

    // 7. Sanitized HTML content (XSS protection)
    const safeName = escapeHtml(cleanName);
    const safeEmail = escapeHtml(cleanEmail);
    const safeTopic = escapeHtml(cleanTopic);
    const safeMessage = escapeHtml(cleanMessage).replace(/\n/g, "<br/>");

    const htmlContent = `
      <div style="font-family: 'Courier New', Courier, monospace; background-color: #fdfbf7; padding: 28px; border-radius: 8px; border: 1px solid #e0d8cc; color: #2b221a; line-height: 1.7;">
        <div style="margin-bottom: 20px; padding-bottom: 14px; border-bottom: 1px dashed #c4b9a8;">
          <p style="margin: 0 0 6px 0; font-size: 13px; color: #7a6e60;"><strong>To:</strong> ${escapeHtml(recipient)}</p>
          <p style="margin: 0 0 6px 0; font-size: 13px; color: #7a6e60;"><strong>From:</strong> ${safeName} &lt;${safeEmail}&gt;</p>
          <p style="margin: 0; font-size: 13px; color: #7a6e60;"><strong>Subject:</strong> ${safeTopic}</p>
        </div>
        <div style="font-size: 15px; margin-bottom: 30px; white-space: pre-wrap;">
${safeMessage}
        </div>
        <div style="border-top: 1px solid #d5cbba; padding-top: 16px; margin-top: 24px;">
          <p style="margin: 0; font-size: 15px; font-weight: bold;">Best Regards,</p>
          <p style="margin: 4px 0 0 0; font-size: 15px;">${safeName}</p>
          <p style="margin: 4px 0 0 0; font-size: 13px; color: #8c7e6d;">${safeEmail}</p>
        </div>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: "Gabriel Post <onboarding@resend.dev>",
      to: [recipient],
      replyTo: cleanEmail,
      subject: cleanTopic,
      text: textContent,
      html: htmlContent,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to send message";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
