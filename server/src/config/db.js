import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

const connectDB = async () => {
  let mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    const memoryServer = await MongoMemoryServer.create({
      instance: {
        args: ["--wiredTigerCacheSizeGB", "0.25"],
      },
    });
    mongoUri = memoryServer.getUri();
    console.log("Using in-memory MongoDB for local development");
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
