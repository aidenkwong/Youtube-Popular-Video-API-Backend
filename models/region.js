import mongoose from "mongoose";

const regionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
});

const regionModel = mongoose.model("region", regionSchema);

export default regionModel;
