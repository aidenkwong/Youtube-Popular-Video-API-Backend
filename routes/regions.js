import express from "express";
import regionModel from "../models/region.js";

const router = express.Router();

router.get("/allRegions", async (req, res) => {
  try {
    const regions = await regionModel.find();

    res.status(200).json({ result: regions });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

export default router;
