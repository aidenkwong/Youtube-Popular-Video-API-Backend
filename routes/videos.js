import express from "express";
import top10VideosModel from "../models/video.js";

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

    res.status(200).json({ result: videos });
  } catch (error) {
    res.status(404).json({ message: error });
  }
});

export default router;
