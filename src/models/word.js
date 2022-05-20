import mongoose from "mongoose";

const wordSchema = new mongoose.Schema({
  word: { type: String, required: true },
  count: { type: Number, required: true },
});

const wordModel = mongoose.model("words", wordSchema);

export default wordModel;
