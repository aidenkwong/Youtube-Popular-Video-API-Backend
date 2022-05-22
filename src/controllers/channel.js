import channelModel from "../models/channel.js";

export const updateChannel = async (id, title, count) => {
  try {
    const result = await channelModel.findOneAndUpdate(
      { id },
      { title, count },
      { upsert: true }
    );
    return result;
  } catch (error) {
    console.log(error);
  }
};
