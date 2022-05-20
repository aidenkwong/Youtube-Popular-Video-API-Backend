import top10VideosModel from "../models/video.js";

export const addVideos = async (region, videos) => {
  const top10Videos = new top10VideosModel({
    time: new Date(),
    region,
    videos,
  });
  await top10Videos.save();
};
