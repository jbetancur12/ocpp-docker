import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ChargerPointSchema = new Schema({
  chargerPointID: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: Date,
});

export default mongoose.model("ChargerPoint", ChargerPointSchema);
