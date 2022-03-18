import regionModel from "../models/region.js";

const addRegion = async (name, code) => {
  const region = new regionModel({
    name,
    code,
  });
  await region.save();
};

export default addRegion;
