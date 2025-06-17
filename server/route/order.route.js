import { Router } from 'express'
import express from 'express';
import auth from '../middleware/auth.js'
import { CashOnDeliveryOrderController, getOrderDetailsController, paymentController, webhookStripe } from '../controllers/order.controller.js'
import { cancelOrderController } from '../controllers/order.controller.js';
import { getAllOrdersForAdmin, updateOrderStatusController } from '../controllers/order.controller.js';
import { admin } from '../middleware/Admin.js';
import checkVerified from '../middleware/checkVerified.js'



const router = express.Router(); // ✅ ye line zaroori hai

const orderRouter = Router()

orderRouter.post("/cash-on-delivery",auth, checkVerified, CashOnDeliveryOrderController)
orderRouter.post('/checkout',auth, checkVerified, paymentController)
orderRouter.post('/webhook',webhookStripe)
orderRouter.get("/order-list",auth, checkVerified, getOrderDetailsController)
orderRouter.post('/cancel', auth, checkVerified, cancelOrderController); // ✅ FIXED
orderRouter.get("/admin/orders", auth, getAllOrdersForAdmin); // for admin
orderRouter.post("/admin/order/update-status", auth, admin, updateOrderStatusController);


export default orderRouter