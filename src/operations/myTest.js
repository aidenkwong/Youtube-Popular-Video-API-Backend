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
  await mongoose.connect(process.env.DATABASE_URL);
  return "connected to db";
};

connectDB()
  .then((res) => console.log(res))
  .catch((err) => console.log(err));

const originalDate = new Date();
const prevDate = new Date(originalDate).setDate(originalDate.getDate() - 1);
const test = async () => {
  const docs = await top10VideosModel.find({
    time: {
      $gte: prevDate,
      $lte: originalDate,
    },
  });
  const titleHashMap = {};
  for (const doc of docs) {
    for (const video of doc.videos) {
      if (!titleHashMap[video.title]) {
        titleHashMap[video.title] = [doc.region];
      } else {
        titleHashMap[video.title].push(doc.region);
      }
    }
  }
  const sorted = Object.entries(titleHashMap).sort(
    (a, b) => titleHashMap[b[0]].length - titleHashMap[a[0]].length
  );
  console.log(sorted.slice(0, 10));
};

test().then(() => exit());
