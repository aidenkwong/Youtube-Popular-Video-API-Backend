import { exit } from "process";
import { config } from "dotenv";
import axios from "axios";
import mongoose from "mongoose";
import regionModel from "../models/region.js";
import { addVideos } from "../controllers/video.js";
import { updateWord } from "../controllers/words.js";
import top10VideosModel from "../models/video.js";

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

const addWordsOp = async () => {
  try {
    const top10Videos = await top10VideosModel.find();
    const hash = {};
    const hashId = [];
    top10Videos.map((itm) =>
      itm.videos.map((video) => {
        if (video.title) {
          const words = video.title.split(" ");
          const isEnglish = (str) => {
            const reg = /^[A-Za-z]+$/;
            return reg.test(str);
          };
          if (hashId.indexOf(video.id) === -1) {
            hashId.push(video.id);
            words.map((word) => {
              if (isEnglish(word)) {
                word in hash ? (hash[word] += 1) : (hash[word] = 1);
              }
            });
          }
        }
      })
    );
    const sorted = Object.entries(hash)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 50)
      .map(async (itm) => {
        await updateWord(itm[0], itm[1]);
        return itm;
      });
    const allRes = await Promise.all(sorted).then((res) => {
      return console.log("addWordsOp done!");
    });
    return allRes;
  } catch (error) {
    console.log(error.message);
  }
};

addVideosOp()
  .then(() => addWordsOp())
  .then(() => exit());
