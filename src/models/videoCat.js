import mongoose from "mongoose";

const videoCatSchema = new mongoose.Schema({
  id: { type: String, required: true },
  videoCat: { type: String, required: true },
  count: { type: Number, required: true },
});

const videoCatModel = mongoose.model("videoCats", videoCatSchema);

export default videoCatModel;
