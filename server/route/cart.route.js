import { Router } from "express";
import auth from "../middleware/auth.js";
import { addToCartItemController, deleteCartItemQtyController, getCartItemController, updateCartItemQtyController } from "../controllers/cart.controller.js";
import checkVerified from '../middleware/checkVerified.js'

const cartRouter = Router()

cartRouter.post('/create',auth, checkVerified, addToCartItemController)
cartRouter.get("/get",auth, checkVerified, getCartItemController)
cartRouter.put('/update-qty',auth, checkVerified, updateCartItemQtyController)
cartRouter.delete('/delete-cart-item',auth, checkVerified, deleteCartItemQtyController)

export default cartRouter