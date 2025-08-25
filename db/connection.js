import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose
      .connect(process.env.MONGODB_URI)
      .then(() => {
        console.log(`MongoDB connected: ${conn.connection.host}`);
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.log(error);
    throw new error("Internal server error.");
  }
};

export default connectDB;
