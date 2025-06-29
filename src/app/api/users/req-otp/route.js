import { generateOTP } from "@/auth/otpHandler";

import { sendOTPmail } from "@/mailHandler/sendMail";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req = NextRequest) {
  try {
    const { email, type } = await req.json();
    if (!email || !type) {
      return NextResponse.json(
        { error: "Email and type are required" },
        { status: 400 }
      );
    }
    const otp = generateOTP();
    const otpexpires = new Date(Date.now() + 5 * 60 * 1000);
    const mailRes = await sendOTPmail(email, otp, type);
    console.log("Mail response:", mailRes);
    return NextResponse.json(
      { message: "OTP sent successfully", otp, otpexpires },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
