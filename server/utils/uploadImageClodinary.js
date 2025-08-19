import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLODINARY_CLOUD_NAME,
  api_key: process.env.CLODINARY_API_KEY,
  api_secret: process.env.CLODINARY_API_SECRET_KEY,
});

const uploadToCloudinary = async (base64Image, folder = "pharma") => {
  return await new Promise((resolve, reject) => {
    cloudinary.uploader.upload(base64Image, { folder }, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

export default uploadToCloudinary;
