import mongoose from "mongoose";

const connectDb = async (): Promise<void> => {
  await mongoose.connect(process.env.MONGODB_URL!); // ! -> this confirms that it is definitely defined.
};

export default connectDb;
