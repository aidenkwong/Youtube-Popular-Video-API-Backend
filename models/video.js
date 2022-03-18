import mongoose from "mongoose";

export const videoSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
});

export const top10VideosSchema = new mongoose.Schema({
  time: { type: Date, required: true },
  region: { type: String, required: true },
  videos: [videoSchema],
});

export const top10VideosModel = mongoose.model(
  "top10Videos",
  top10VideosSchema
);
