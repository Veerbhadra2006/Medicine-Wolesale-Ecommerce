import Stripe from "../config/stripe.js";
import CartProductModel from "../models/cartproduct.model.js";
import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";
import ProductModel from "../models/product.model.js";
import mongoose from "mongoose";

export async function CashOnDeliveryOrderController(request, response) {
  try {
    const userId = request.userId;
    const { list_items, totalAmt, addressId, subTotalAmt } = request.body;

    for (let el of list_items) {
      const product = await ProductModel.findById(el.productId._id);

      if (!product) {
        return response.status(404).json({
          message: `Product not found: ${el.productId._id}`,
          error: true,
          success: false
        });
      }

      if (product.stock < el.quantity) {
        return response.status(400).json({
          message: `😕 Insufficient stock for ${product.name}`,
          error: true,
          success: false
        });
      }
    }

    for (let el of list_items) {
      await ProductModel.updateOne(
        { _id: el.productId._id },
        { $inc: { stock: -el.quantity } }
      );
    }

    const payload = list_items.map(el => ({
      userId,
      orderId: `ORD-${new mongoose.Types.ObjectId()}`,
      productId: el.productId._id,
      product_details: {
        name: el.productId.name,
        image: el.productId.image
      },
      paymentId: "",
      payment_status: "CASH ON DELIVERY",
      delivery_address: addressId,
      subTotalAmt,
      totalAmt
    }));

    const generatedOrder = await OrderModel.insertMany(payload);

    await CartProductModel.deleteMany({ userId });
    await UserModel.updateOne({ _id: userId }, { shopping_cart: [] });

    return response.json({
      message: "Order successfully placed",
      error: false,
      success: true,
      data: generatedOrder
    });

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    });
  }
}

export const pricewithDiscount = (price, dis = 1) => {
  const discountAmout = Math.ceil((Number(price) * Number(dis)) / 100);
  const actualPrice = Number(price) - Number(discountAmout);
  return actualPrice;
};

export async function paymentController(request, response) {
  try {
    const userId = request.userId;
    const { list_items, totalAmt, addressId, subTotalAmt } = request.body;

    const user = await UserModel.findById(userId);

    const line_items = list_items.map(item => {
      return {
        price_data: {
          currency: 'inr',
          product_data: {
            name: item.productId.name,
            images: item.productId.image,
            metadata: {
              productId: item.productId._id
            }
          },
          unit_amount: pricewithDiscount(item.productId.price, item.productId.discount) * 100
        },
        adjustable_quantity: {
          enabled: true,
          minimum: 1
        },
        quantity: item.quantity
      };
    });

    const params = {
      submit_type: 'pay',
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: user.email,
      metadata: {
        userId: userId,
        addressId: addressId
      },
      line_items: line_items,
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`
    };

    const session = await Stripe.checkout.sessions.create(params);

    return response.status(200).json(session);

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    });
  }
}

const getOrderProductItems = async ({
  lineItems,
  userId,
  addressId,
  paymentId,
  payment_status,
}) => {
  const productList = [];

  if (lineItems?.data?.length) {
    for (const item of lineItems.data) {
      const product = await Stripe.products.retrieve(item.price.product);
      const productId = product.metadata.productId;
      const quantity = item.quantity;

      const dbProduct = await ProductModel.findById(productId);

      if (!dbProduct) throw new Error(`Product not found: ${productId}`);

      if (dbProduct.stock < quantity) {
        throw new Error(
          `Out of stock"${dbProduct.name}". Available: ${dbProduct.stock}, Requested: ${quantity}`
        );
      }

      await ProductModel.updateOne(
        { _id: productId },
        { $inc: { stock: -quantity } }
      );

      productList.push({
        userId,
        orderId: `ORD-${new mongoose.Types.ObjectId()}`,
        productId,
        product_details: {
          name: product.name,
          image: product.images,
        },
        paymentId,
        payment_status,
        delivery_address: addressId,
        subTotalAmt: Number(item.amount_total / 100),
        totalAmt: Number(item.amount_total / 100),
      });
    }
  }

  return productList;
};

export async function webhookStripe(request, response) {
  const event = request.body;
  const endPointSecret = process.env.STRIPE_ENPOINT_WEBHOOK_SECRET_KEY;

  switch (event.type) {
    case 'checkout.session.completed':
      try {
        const session = event.data.object;
        const lineItems = await Stripe.checkout.sessions.listLineItems(session.id);
        const userId = session.metadata.userId;

        const orderProduct = await getOrderProductItems({
          lineItems,
          userId,
          addressId: session.metadata.addressId,
          paymentId: session.payment_intent,
          payment_status: session.payment_status,
        });

        const order = await OrderModel.insertMany(orderProduct);

        if (order.length > 0) {
          await UserModel.findByIdAndUpdate(userId, { shopping_cart: [] });
          await CartProductModel.deleteMany({ userId });
        }
      } catch (err) {
        console.log("Stripe Order Error:", err.message);
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  response.json({ received: true });
}

export async function getOrderDetailsController(req, res) {
  try {
    const userId = req.userId;
    const user = await UserModel.findById(userId);
    const isAdmin = user?.role === "ADMIN";

    const orderlist = await OrderModel
      .find(isAdmin ? {} : { userId })
      .sort({ createdAt: -1 })
      .populate("delivery_address")
      .populate("userId", "name email");

    return res.json({
      message: "Order list",
      data: orderlist,
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export const cancelOrderController = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    const order = await OrderModel.findOne({ orderId });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = "Cancelled";
    await order.save();

    return res.status(200).json({
      message: "Order cancelled successfully",
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Cancel order error:", error);
    res.status(500).json({
      message: "Server error while cancelling order",
      error: true,
    });
  }
};

export const getAllOrdersForAdmin = async (req, res) => {
  try {
    const orders = await OrderModel.find({})
      .sort({ createdAt: -1 })
      .populate('delivery_address')
      .populate('userId');
    res.json({ data: orders });
  } catch (error) {
    res.status(500).json({ message: error.message, error: true });
  }
};

export const updateOrderStatusController = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    const updated = await OrderModel.findOneAndUpdate(
      { orderId },
      { status },
      { new: true }
    );
    res.json({ message: 'Status updated', data: updated });
  } catch (error) {
    res.status(500).json({ message: error.message, error: true });
  }
};
