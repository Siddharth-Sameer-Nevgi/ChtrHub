import { connectdb } from "@/dbconfig/dbconfig";
import User from "@/models/userSchema";
import Room from "@/models/roomInfo";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

connectdb();

export async function GET(req = NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    console.log("Parameters:", searchParams.toString());
    const roomID = searchParams.get("roomID");
    console.log("Room ID:", roomID);

    if (!roomID) {
      return NextResponse.json(
        { error: "Room ID is required" },
        { status: 400 }
      );
    }
    const messages = await Room.findOne({ roomID }).select("messages");
    return NextResponse.json(
      { messages: messages?.messages || [] },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req = NextRequest) {
  try {
    const token = req.cookies.get("token")?.value || "";
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tokenData = jwt.verify(token, process.env.SESSION_SECRET);
    const user = await User.findById(tokenData.id).select("username");

    const details = await req.json();

    if (!details.roomID || !details.message) {
      return NextResponse.json(
        { error: "Room ID and message are required" },
        { status: 400 }
      );
    }
    await Room.findOneAndUpdate(
      { roomID: details.roomID },
      {
        $push: {
          messages: { sender: user.username, content: details.message },
        },
      }
    );

    return NextResponse.json(
      { message: "Message sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
