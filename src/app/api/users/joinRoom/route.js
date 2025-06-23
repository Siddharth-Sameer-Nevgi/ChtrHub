import { connectdb } from "@/dbconfig/dbconfig";
import User from "@/models/userSchema";
import Room from "@/models/roomInfo";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

connectdb();
export async function GET(req = NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const roomID = searchParams.get("roomID");

    if (!roomID) {
      return NextResponse.json(
        { error: "Room ID is required" },
        { status: 400 }
      );
    }

    const token = req.cookies.get("token")?.value || "";
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tokenData = jwt.verify(token, process.env.SESSION_SECRET);
    const user = await User.findById(tokenData.id).select("username");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const room = await Room.findOne({ roomID });
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }
    await Room.findOneAndUpdate(
      { roomID },
      { $addToSet: { users: user.username } }
    );

    return NextResponse.json(
      { message: "Joined room successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
