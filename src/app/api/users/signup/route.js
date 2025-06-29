import { connectdb } from "@/dbconfig/dbconfig";
import User from "@/models/userSchema";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

connectdb();

export async function POST(req = NextRequest) {
  try {
    const reqContent = await req.json();
    const { username, email, password } = reqContent;

    console.log("Received data:", reqContent);

    const user = await User.findOne({ email });

    if (user) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    console.log("User saved successfully:", savedUser);

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
