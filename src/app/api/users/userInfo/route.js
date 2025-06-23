import { connectdb } from "@/dbconfig/dbconfig";
import User from "@/models/userSchema";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

connectdb();
export async function GET(req = NextRequest) {
  try {
    const token = req.cookies.get("token")?.value || "";
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tokenData = jwt.verify(token, process.env.SESSION_SECRET);
    const user = await User.findById(tokenData.id).select("username");

    return NextResponse.json({ user: user.username }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req = NextRequest) {
  try {
    const response = NextResponse.json({ message: "Logged out successfully" });

    response.cookies.set("token", "", {
      httpOnly: true,
      path: "/",
      expires: new Date(0),
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
