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

const test = async () => {
  const docs = await top10VideosModel.find();
  const firstDate = docs[0].time;
  console.log({ firstDate });
  const sorted = docs
    .sort((a, b) => a.time - b.time)
    .sort((a, b) => a.region.localeCompare(b.region))
    .map((doc) => ({
      region: doc.region,
      date: doc.time.toISOString().slice(0, 10),
    }));

  const tree = {};
  // Map sorted to tree
  sorted.forEach((doc) => {
    const { region, date } = doc;
    if (!tree[region]) {
      tree[region] = [date];
    } else {
      tree[region].push(date);
    }
  });

  const noOfDates = {};

  for (let region in tree) {
    // Calculate the number of dates for each region
    if (!noOfDates[tree[region].length]) {
      noOfDates[tree[region].length] = [region];
    } else {
      noOfDates[tree[region].length].push(region);
    }

    // Check if there is outlier
    let myDate = new Date(firstDate);
    for (let i = 0; i < tree[region].length; i++) {
      const date = tree[region][i];
      if (date !== myDate.toISOString().slice(0, 10)) {
        console.log({ Outlier: tree[region], date });
      }
      myDate.setDate(myDate.getDate() + 1);
    }
  }
  console.log({ noOfDates: Object.keys(noOfDates) });
};

test().then(() => exit());
