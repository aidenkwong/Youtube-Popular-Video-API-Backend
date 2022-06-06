import express from "express";
import channelModel from "../models/channel.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const channels = await channelModel.find().sort({ count: -1 }).limit(30);

    res.status(200).json({ result: channels });
  } catch (error) {
    res.status(404).json({ error });
  }
});

export default router;
