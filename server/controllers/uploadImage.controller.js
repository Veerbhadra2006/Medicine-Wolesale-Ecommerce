import uploadToCloudinary from "../utils/uploadImageClodinary.js";

const uploadImageController = async (request, response) => {
  try {
    const file = request.file;

    if (!file) {
      return response.status(400).json({
        message: "No file uploaded",
        error: true,
        success: false,
      });
    }

    // buffer → base64 string
    const base64Image = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

    // Cloudinary pe upload
    const uploadImage = await uploadToCloudinary(base64Image, "pharma");

    return response.json({
      message: "Upload done",
      data: uploadImage,
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export default uploadImageController;
