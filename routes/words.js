import express from "express";

import top10VideosModel from "../models/video.js";

const router = express.Router();

router.get("/mostFrequentWords", async (req, res) => {
  try {
    const { number } = req.query;
    const top10Videos = await top10VideosModel.find();
    const hash = {};
    const hashId = [];
    top10Videos.map((itm) =>
      itm.videos.map((video) => {
        if (video.title) {
          const words = video.title.split(" ");
          const isEnglish = (str) => {
            const reg = /^[A-Za-z]+$/;
            return reg.test(str);
          };
          if (hashId.indexOf(video.id) === -1) {
            hashId.push(video.id);
            words.map((word) => {
              if (isEnglish(word)) {
                word in hash ? (hash[word] += 1) : (hash[word] = 1);
              }
            });
          }
        }
      })
    );
    const sorted = Object.keys(hash)
      .map((key) => [key, hash[key]])
      .sort((a, b) => b[1] - a[1])
      .slice(0, number)
      .map((itm) => ({ word: itm[0], count: itm[1] }));
    res.status(200).json({ result: sorted });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

export default router;
