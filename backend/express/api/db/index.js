import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const DB_NAME = "Askio";
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    // console.log(`\n ${connectionInstance}`)
    console.log(
      `\n MongoDB Connected || DB HOST :${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error("MongoDB connection Error: ", error);
    process.exit(1);
  }
};

export default connectDB;
