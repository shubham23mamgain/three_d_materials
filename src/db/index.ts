import mongoose from "mongoose";


mongoose.connect(process.env.MONGO_URL!).then(
    () => console.log("DB Connected")).catch
    ((error) => console.log("DB Connection Failed", error));