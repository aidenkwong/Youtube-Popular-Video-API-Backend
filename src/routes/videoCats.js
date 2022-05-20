import express from "express";
import videoCatModel from "../models/videoCat.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const videoCats = await videoCatModel.find();

    res.status(200).json({ result: videoCats });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

export default router;
