import wordModel from "../models/words.js";

export const updateWord = async (word, count) => {
  wordModel.countDocuments({ word: word }, (err, docCount) => {
    if (docCount === 0) {
      const newWord = new wordModel({
        word,
        count,
      });
      newWord.save();
    } else {
      wordModel.findOneAndUpdate(
        { word: word },
        { count: count },
        (err, doc) => {
          if (err) {
            console.log(err);
          }
        }
      );
    }
  });
};
