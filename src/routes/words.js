import express from "express";
import wordModel from "../models/word.js";

const router = express.Router();

router.get("/mostFrequentWords", async (req, res) => {
  const { number } = req.query;

  try {
    const top10Word = await wordModel.find().sort({ count: -1 }).limit(number);
    res.status(200).json({ result: top10Word });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

export default router;
