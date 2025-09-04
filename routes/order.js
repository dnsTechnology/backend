import express from "express";
import { sendRes } from "../utils/utils.js";
import { sendBookingMailToUserAndAdmin } from "../utils/sendMail.js";
import Order from "../models/order.js";

const router = express.Router();

router.post("/create", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      productName,
      productPrice,
      productStock,
      quantity,
      queries,
    } = req.body;

    const response = await sendBookingMailToUserAndAdmin(
      { ...req.body },
      req,
      res
    );
    if (!response.success) {
      return sendRes(response.message, [], 500, false, res);
    }

    // Here, you would typically save the order to your database
    if (
      !name ||
      !email ||
      !phone ||
      !productName ||
      !productPrice ||
      !quantity
    ) {
      return sendRes("Missing required fields", [], 400, false, res);
    }
    // Simulate order creation
    const order = {
      customer: { name, email, phone },
      product: { productName, productPrice, productStock, quantity, queries },
      status: "Pending",
      totalPrice: productPrice * quantity,
    };

    // In a real application, you would save 'order' to the database here
    if (!order) {
      return sendRes("Order creation failed", [], 500, false, res);
    }
    await Order.create(order);
    return sendRes(
      "request submitted we will get back to you soon",
      order,
      201,
      true,
      res
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return sendRes("Internal server error", [], 500, false, res);
  }
});

export default router;
