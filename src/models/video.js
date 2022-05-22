import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  videoCat: { type: String },
  tags: { type: Array },
  channelId: { type: String },
});

const top10VideosSchema = new mongoose.Schema({
  time: { type: Date, required: true },
  region: { type: String, required: true },
  videos: [videoSchema],
});

const top10VideosModel = mongoose.model("top10Videos", top10VideosSchema);

export default top10VideosModel;
