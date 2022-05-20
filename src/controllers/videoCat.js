import videoCatModel from "../models/videoCat.js";

export const updateVideoCat = async (id, videoCat, count) => {
  try {
    videoCatModel.findOneAndUpdate(
      { id },
      { videoCat, count },
      { upsert: true },
      function (err, doc) {
        if (err) {
          console.log(err);
          return;
        }
        return doc;
      }
    );
  } catch (error) {
    console.log(error);
  }
};
