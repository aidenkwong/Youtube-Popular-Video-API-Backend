import wordModel from "../models/word.js";

export const updateWord = async (word, count) => {
  const docCount = await wordModel.countDocuments({ word: word });
  if (docCount === 0) {
    const newWord = new wordModel({
      word,
      count,
    });
    await newWord.save();
  } else {
    const result = await wordModel.findOneAndUpdate({ word }, { count });
    return result;
  }
};
