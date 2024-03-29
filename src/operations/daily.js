import { exit } from "process";
import { config } from "dotenv";
import axios from "axios";
import mongoose from "mongoose";
import regionModel from "../models/region.js";
import { addVideos } from "../controllers/video.js";
import { updateWord } from "../controllers/word.js";
import { updateVideoCat } from "../controllers/videoCat.js";
import { updateChannel } from "../controllers/channel.js";
import top10VideosModel from "../models/video.js";
import youtube_video_cat_list from "../constants/youtube_video_cat_list.js";

config();

const connectDB = async () => {
  await mongoose.connect(process.env.DATABASE_URL);
  return "connected to db";
};

connectDB()
  .then((res) => console.log(res))
  .catch((err) => console.log(err));

const addVideosOp = async () => {
  const docs = await regionModel.find();

  const promises = docs.map(async (doc) => {
    const { data } = await axios.get(
      `https://youtube.googleapis.com/youtube/v3/videos?part=snippet&part=statistics&chart=mostPopular&maxResults=10&key=${process.env.BACKUP_YOUTUBE_API_KEY}&regionCode=${doc.code}`
    );

    return data?.items?.map((item) => ({
      id: item.id,
      title: item.snippet.title,
      videoCat: item.snippet.categoryId,
      channelId: item.snippet.channelId,
      tags: item.snippet?.tags || [],
      region: doc.name,
    }));
  });

  const allRes = await Promise.all(promises);

  const promises2 = allRes.map(async (videos) => {
    await addVideos(
      videos[0].region,
      videos.map((video) => {
        delete video.region;
        return video;
      })
    ).catch((err) => console.log(err));
    return videos;
  });

  const allRes2 = await Promise.all(promises2).then(() =>
    console.log("addVideosOp done!")
  );
  return allRes2;
};

const upsertDataOp = async () => {
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
      return await updateWord(itm[0], itm[1]);
    });

  const videoCatRank = Object.entries(videoCatHash)
    .sort((a, b) => b[1] - a[1])
    .map(async (itm) => {
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
      const { data } = await axios.get(
        `https://youtube.googleapis.com/youtube/v3/channels?part=snippet&id=${channel[0]}&key=${process.env.BACKUP_YOUTUBE_API_KEY}`
      );
      const targetChannel = data.items[0];
      return await updateChannel(
        channel[0],
        targetChannel.snippet.title,
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

addVideosOp()
  .then(() => upsertDataOp())
  .then(() => exit());
