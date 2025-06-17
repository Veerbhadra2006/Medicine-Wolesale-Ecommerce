import { Router } from 'express';
import { getUnverifiedUsers, getVerifiedUsers, updateUserDetails, updateUserStatus, verifyUserById } from '../controllers/user.controller.js';
import { createBanner, getBanners, deleteBanner } from '../controllers/banner.controller.js';
import auth from '../middleware/auth.js';
import {admin} from '../middleware/Admin.js';

const adminRouter = Router();

adminRouter.get('/unverified-users', auth, admin, getUnverifiedUsers);
adminRouter.put('/verify-user/:id', auth, admin, verifyUserById);
adminRouter.get("/verified-users", auth, admin, getVerifiedUsers);
adminRouter.put('/update-user-status/:id', auth, admin, updateUserStatus);

adminRouter.post('/banner', auth, admin, createBanner);  // upload with type (top/middle)
adminRouter.get('/banners', getBanners);   // public with optional query param: ?type=top/middle
adminRouter.delete('/banner/:id', auth, admin, deleteBanner); 



export default adminRouter;
