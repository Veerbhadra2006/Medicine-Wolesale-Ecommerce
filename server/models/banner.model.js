// banner.model.js
import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({

  image_url: String,
  link_url: String,
  type: {
    type: String,
    enum: ['top', 'middle'], // can extend later
    default: 'top'
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Banner = mongoose.model('Banner', bannerSchema);

export default Banner;
