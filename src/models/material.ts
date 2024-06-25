import { Schema, model } from "mongoose";

const materialSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Name is Required field"],
            minLength: [4, "Name must be atleast 3 characters"],
        },
        technology: {
            type: String,
            required: [true, "Required field and Must be FDM, SLA or SLS"],
            enum: ["FDM", "SLA", "SLS"],
        },
        colors: {
            type: [String],
            required: [true, "At least one colour is required"]
        },
        applicationTypes: {
            type: [String],
            required: [true, "At least one application type is required"]
        },
        pricePerGram: {
            type: Number,
            required: [true, "Price Per Gram is reqired field"],
        },
        imageUrl: {
            type: Object,
            url: String,
            id: String,
            required: [true, "Image is required field"],
        },
    },
    { timestamps: true }
);

export default model("Material", materialSchema);