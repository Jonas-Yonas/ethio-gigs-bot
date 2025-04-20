import { GigModel } from "../models/gig.js";

export const saveGig = async (data) => {
  const gig = new GigModel(data);
  await gig.save();
};
