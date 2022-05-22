import { exit } from "process";
import { config } from "dotenv";
import mongoose from "mongoose";
import { updateWord } from "../controllers/word.js";
import { updateVideoCat } from "../controllers/videoCat.js";
import top10VideosModel from "../models/video.js";
import youtube_video_cat_list from "../constants/youtube_video_cat_list.js";
import { updateChannel } from "../controllers/channel.js";
import axios from "axios";

config();

const connectDB = async () => {
  await mongoose.connect(process.env.TESTING_DATABASE_URL);
  return "connected to db";
};

connectDB()
  .then((res) => console.log(res))
  .catch((err) => console.log(err));

const test = async () => {
  const docs = await top10VideosModel.find();

  const hashMap = {};
  for (const item of docs) {
    for (const video of item.videos) {
      for (const tag of video.tags) {
        hashMap[tag] ? (hashMap[tag] += 1) : (hashMap[tag] = 1);
      }
    }
  }

  const rank = Object.entries(hashMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50);
  console.log(rank);
};

test().then(() => exit());
