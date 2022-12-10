import express from "express";
import top10VideosModel from "../models/video.js";
import youtube_video_cat_list from "../constants/youtube_video_cat_list.js";

const router = express.Router();

router.get("/top10Videos", async (req, res) => {
  const { region, date } = req.query;
  const originalDate = new Date(date);
  const prevDate = new Date(originalDate).setDate(originalDate.getDate() - 1);

  try {
    const { videos } = await top10VideosModel
      .findOne({
        region: region,
        time: {
          $gte: prevDate,
          $lte: originalDate,
        },
      })
      .sort({ time: -1 })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Internal server error");
      });

    const videoCatList = youtube_video_cat_list.items;
    const videos2 = videos.map((itm) => {
      const videoCat =
        videoCatList.find((cat) => cat.id === itm.videoCat) || "";
      return Object.assign(itm, { videoCat: videoCat.snippet.title });
    });

    res.status(200).json({ result: videos2 });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error });
  }
});

router.get("/totalVideosCount", async (req, res) => {
  await top10VideosModel
    .count()
    .then((count) => {
      res.status(200).json({ count: count * 10 });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Internal server error");
    });
});

export default router;
