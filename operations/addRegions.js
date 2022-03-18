import { exit } from "process";
import { config } from "dotenv";
import axios from "axios";
import mongoose from "mongoose";
import addRegion from "../controllers/region.js";

config();

const connectDB = async () => {
  await mongoose.connect(process.env.DATABASE_URL);
};

connectDB()
  .then((res) => console.log(res))
  .catch((err) => console.log(err));

const fetchData = async () => {
  const { data } = await axios.get(
    `https://youtube.googleapis.com/youtube/v3/i18nRegions?part=snippet&key=${process.env.BACKUP_YOUTUBE_API_KEY}`
  );
  data.items.map(async (item) => {
    await addRegion(item.snippet.name, item.id);
  });
};

fetchData()
  .catch((err) => console.log(err))
  .then((res) => exit());
