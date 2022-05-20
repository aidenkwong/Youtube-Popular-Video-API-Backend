import regionModel from "../models/region.js";

export const addRegion = async (name, code) => {
  const region = new regionModel({
    name,
    code,
  });
  await region.save();
};
