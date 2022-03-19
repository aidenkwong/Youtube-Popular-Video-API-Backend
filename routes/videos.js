import express from "express";
import top10VideosModel from "../models/video.js";

const router = express.Router();

router.get("/top10Videos", async (req, res) => {
  const { region } = req.query;
  try {
    const { videos } = await top10VideosModel
      .findOne({ region: region })
      .sort({ time: -1 });
    res.status(200).json({ result: videos });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

export default router;
