import mongoose from 'mongoose';

const mongoDB = "mongodb://127.0.0.1/banking_db";

const connectToDB = async () => {
    try {
        await mongoose.connect(mongoDB, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }

    const dbConnection = mongoose.connection;

    return dbConnection;
};

export default connectToDB;