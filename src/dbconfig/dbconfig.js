import mongoose from "mongoose";

export async function connectdb() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    const connection = mongoose.connection;
    connection.on("connected", () => {
      console.log("Mongoose connected to db");
    });

    connection.on("error", (err) => {
      console.error("Mongoose connection error:", err);
    });
    connection.on("disconnected", () => {
      console.log("Mongoose disconnected from db");
    });
  } catch (error) {
    console.error("Database connection failed:", error);
    throw error;
  }
}
