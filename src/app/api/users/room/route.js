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

export async function DELETE(req = NextRequest) {
  try {
    const token = req.cookies.get("token")?.value || "";
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tokenData = jwt.verify(token, process.env.SESSION_SECRET);
    const user = await User.findById(tokenData.id).select("username");

    const { searchParams } = new URL(req.url);
    const roomID = searchParams.get("roomID");
    const messageId = searchParams.get("messageId");

    if (!roomID || !messageId) {
      return NextResponse.json(
        { error: "Room ID and message ID are required" },
        { status: 400 }
      );
    }

    // Find the room and check if the message belongs to the user
    const room = await Room.findOne({ roomID });
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const message = room.messages.id(messageId);
    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    // Check if the user is the sender of the message
    if (message.sender !== user.username) {
      return NextResponse.json(
        { error: "You can only delete your own messages" },
        { status: 403 }
      );
    }

    // Remove the message
    await Room.findOneAndUpdate(
      { roomID },
      { $pull: { messages: { _id: messageId } } }
    );

    return NextResponse.json(
      { message: "Message deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
