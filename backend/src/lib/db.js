import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        // console.log(`MongoDB Connected: ${conn.connection.host}`);
        console.log("MongoDB Connected");
        
    } catch (error) {
        console.log("Error in connecting to Mongo DB" , error);
        process.exit(1);
    }
} 