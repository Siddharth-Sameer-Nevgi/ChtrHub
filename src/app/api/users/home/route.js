import { connectdb } from "@/dbconfig/dbconfig";
import User from "@/models/userSchema";
import Room from "@/models/roomInfo";
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
    const user = await User.findById(tokenData.id).select("-password");
    console.log("User data:", user);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const members = await Room.find({ users: user.username }).select("roomID");
    if (!members) {
      return NextResponse.json({ error: "No rooms found" }, { status: 404 });
    }
    return NextResponse.json(
      { user, isMember: members || [] },
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
    const user = await User.findById(tokenData.id).select("-password");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const details = await req.json();
    if (!details.roomID) {
      return NextResponse.json(
        { error: "Room ID is required" },
        { status: 400 }
      );
    }

    const existingRoom = await Room.findOne({ roomID: details.roomID });
    if (existingRoom) {
      return NextResponse.json(
        { error: "Room ID already exists" },
        { status: 400 }
      );
    }

    const newRoom = new Room({
      owner: user._id,
      roomID: details.roomID,
      users: [user.username],
    });

    await newRoom.save();
    return NextResponse.json(
      { message: "Room created successfully", roomID: details.roomID },
      { status: 201 }
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
    const user = await User.findById(tokenData.id).select("-password");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const details = await req.json();
    if (!details.roomID) {
      return NextResponse.json(
        { error: "Room ID is required" },
        { status: 400 }
      );
    }

    const room = await Room.findOneAndDelete({
      roomID: details.roomID,
      owner: user._id,
    });
    if (!room) {
      return NextResponse.json(
        { error: "Room not found or you are not the owner" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Room deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
