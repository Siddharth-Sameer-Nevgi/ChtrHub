import { connectdb } from "@/dbconfig/dbconfig";
import User from "@/models/userSchema";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

connectdb();

export async function POST(req = NextRequest) {
  try {
    const reqContent = await req.json();
    const { email, password } = reqContent;

    console.log("Received data:", reqContent);

    const user = await User.findOne({ email });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Adding cookies
    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    const token = jwt.sign(tokenData, process.env.SESSION_SECRET, {
      expiresIn: "1d",
    });

    const response = NextResponse.json(
      { message: "Login successful" },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
