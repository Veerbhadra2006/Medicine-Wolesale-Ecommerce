// middleware/checkVerified.js
import UserModel from "../models/user.model.js"

const checkVerified = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.userId)

    if (user.status !== "Active") {
      return res.status(403).json({
        message: `Access denied. Your account status is '${user.status}'.`,
        error: true,
        success: false
      });
    }

     if (!user.checkVerified) {
            return res.status(403).json({
                message: "Your account is not verified by admin. Please complete verification.",
                error: true,
                success: false,
            });
        }

    next();
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Something went wrong",
      error: true,
      success: false
    });
  }
};

export default checkVerified;
