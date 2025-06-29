import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userSchema";
import { connectdb } from "@/dbconfig/dbconfig";
import bcrypt from "bcryptjs";

connectdb();

export async function POST(req = NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();
    return NextResponse.json(
      { message: "Password changed successfully" },
      { status: 200 }
    );
  } catch (error) {
    NextResponse.json({ error: error.message }, { status: 500 });
  }
}
