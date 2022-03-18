import { exit } from "process";
import { config } from "dotenv";
import axios from "axios";
import mongoose from "mongoose";
import regionModel from "./models/region.js";
import addVideos from "./controllers/video.js";

config();

const connectDB = async () => {
  await mongoose.connect(process.env.DATABASE_URL);
};

connectDB()
  .then((res) => console.log(res))
  .catch((err) => console.log(err));

const fetchData = async () => {
  regionModel.find({}).then((docs) => {
    const promises = docs.map(async (doc) => {
      const { data } = await axios.get(
        `https://youtube.googleapis.com/youtube/v3/videos?part=snippet&part=statistics&chart=mostPopular&maxResults=10&key=${process.env.BACKUP_YOUTUBE_API_KEY}&regionCode=${doc.code}`
      );

      return data?.items?.map((item) => ({
        id: item.id,
        title: item.snippet.title,
        region: doc.name,
      }));
    });
    Promise.all(promises).then((res) => {
      const promises2 = res.map(async (videos) => {
        await addVideos(
          videos[0].region,
          videos.map((video) => {
            delete video.region;
            return video;
          })
        );
        return videos;
      });

      Promise.all(promises2).then((res) => {
        console.log("done!");
        exit();
      });
    });
  });
};

fetchData();
