import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  count: { type: Number, required: true },
});

const channelModel = mongoose.model("channels", channelSchema);

export default channelModel;
