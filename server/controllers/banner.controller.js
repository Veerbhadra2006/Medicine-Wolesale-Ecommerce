import Banner from '../models/banner.model.js';
import uploadToCloudinary from '../utils/uploadImageClodinary.js';

export const createBanner = async (req, res) => {
  try {
    const { link_url, image, type } = req.body;

    const cloud = await uploadToCloudinary(image);

    const banner = await Banner.create({
      image_url: cloud.secure_url,
      link_url,
      type: type || 'top', // fallback to top
    });

    res.status(201).json(banner);
  } catch (err) {
    res.status(500).json({ error: 'Banner upload failed', detail: err.message });
  }
};


export const getBanners = async (req, res) => {
  try {
    const { type } = req.query;

    const query = type ? { type } : {};
    const banners = await Banner.find(query).sort({ created_at: -1 });

    res.json(banners);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch banners' });
  }
};

export const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    await Banner.findByIdAndDelete(id);
    res.json({ message: 'Banner deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Could not delete banner' });
  }
};

// export const updateBanner = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { link_url, image } = req.body;
//     const cloud = await uploadToCloudinary(image, 'banners');
//     const banner = await Banner.findById(id);
//     banner.link_url = link_url;
//     banner.image_url = cloud.secure_url;
//     await banner.save();
//     res.json(banner);
//   } catch (err) {
//     res.status(500).json({ error: 'Could not update banner' });
//   }
// };