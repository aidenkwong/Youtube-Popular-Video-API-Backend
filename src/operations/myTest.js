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
  const top10Videos = await top10VideosModel.find();

  const wordHash = {};
  const videoCatHash = {};
  const videoId = [];
  const channelHash = {};

  for (const item of top10Videos) {
    for (const video of item.videos) {
      const id = video.id;
      const title = video.title;
      const cat = video.videoCat;

      if (videoId.indexOf(id) === -1) {
        videoId.push(id);

        if (title) {
          const words = title.split(" ");
          const isEnglish = (str) => {
            const reg = /^[A-Za-z]+$/;
            return reg.test(str);
          };
          words.map((word) => {
            if (isEnglish(word)) {
              word in wordHash ? (wordHash[word] += 1) : (wordHash[word] = 1);
            }
          });
        }

        if (cat) {
          cat in videoCatHash
            ? (videoCatHash[cat] += 1)
            : (videoCatHash[cat] = 1);
        }
      }

      if (video.channelId) {
        video.channelId in channelHash
          ? (channelHash[video.channelId] += 1)
          : (channelHash[video.channelId] = 1);
      }
    }
  }

  const wordRank = Object.entries(wordHash)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50)
    .map(async (itm) => {
      console.log(itm);
      return await updateWord(itm[0], itm[1]);
    });

  const videoCatRank = Object.entries(videoCatHash)
    .sort((a, b) => b[1] - a[1])
    .map(async (itm) => {
      console.log(itm);
      const videoCatList = youtube_video_cat_list.items;
      for (let i = 0; i < videoCatList.length; i++) {
        if (itm[0] === videoCatList[i].id) {
          return await updateVideoCat(
            itm[0],
            videoCatList[i].snippet.title,
            itm[1]
          );
        }
      }
    });

  const channelRank = Object.entries(channelHash)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50)
    .map(async (channel) => {
      console.log(channel);
      const { data } = await axios.get(
        `https://youtube.googleapis.com/youtube/v3/channels?part=snippet&id=${channel[0]}&key=${process.env.BACKUP_YOUTUBE_API_KEY}`
      );
      const targetChannel = data.items[0];
      return await updateChannel(
        channel[0],
        targetChannel.snippet.title,
        targetChannel.snippet.customUrl,
        channel[1]
      );
    });

  const allRes = await Promise.all([
    ...wordRank,
    ...videoCatRank,
    ...channelRank,
  ]).then((res) => {
    return console.log("upsertDataOp done!");
  });
  return allRes;
};

test().then(() => exit());
