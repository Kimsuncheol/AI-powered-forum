import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

interface EmailRequest {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: EmailRequest = await req.json();
    const { to, subject, text, html } = body;

    // Validate required fields
    if (!to || !subject) {
      return NextResponse.json(
        { error: "Missing required fields: to, subject" },
        { status: 400 }
      );
    }

    // Check environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("Email configuration missing");
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send email
    const info = await transporter.sendMail({
      from: `"AI Forum" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text: text || "",
      html: html || text || "",
    });

    console.log("Email sent:", info.messageId);

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
    });
  } catch (error) {
    console.error("Failed to send email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
