import { top10VideosModel } from "../models/video.js";

const addVideos = async (region, videos) => {
  const top10Videos = new top10VideosModel({
    time: new Date(),
    region,
    videos,
  });
  await top10Videos.save();
};

export default addVideos;
