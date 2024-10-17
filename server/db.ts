import "colors";
import mongoose from "mongoose";

const connectDB = async () => {
  console.log("Connecting to MongoDB...", process.env.MONGO_URI!);
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI!);
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
