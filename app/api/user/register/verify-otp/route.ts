import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp)
      return NextResponse.json(
        { error: "Email and OTP required" },
        { status: 400 }
      );

    // Check OTP
    if (global.otpStore && global.otpStore[email] === otp) {
      delete global.otpStore[email]; // remove OTP after use
      return NextResponse.json({ valid: true });
    }

    return NextResponse.json({ valid: false });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
