import express from "express";
import { sendRes } from "../utils/utils.js";
import { sendBookingMailToUserAndAdmin } from "../utils/sendMail.js";
import Order from "../models/order.js";
import mongoose from "mongoose";
import { sendMailBack } from "../utils/sendGeneralEnquiry.js";

const router = express.Router();

router.post("/create", async (req, res) => {
  try {
    const {
      productId,
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
      !productId ||
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
      product: {
        productId,
        productName,
        productPrice,
        productStock,
        quantity,
        queries,
      },
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

router.put("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) return sendRes("Status is required", [], 400, false, res);

    const order = await Order.findById(id);
    if (!order) return sendRes("Order not found", [], 404, false, res);

    order.status = status;
    await order.save();

    return sendRes("Order status updated successfully", order, 200, true, res);
  } catch (error) {
    console.error("Error updating order status:", error);
    return sendRes("Internal server error", [], 500, false, res);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { discount, name, productName, productPrice, quantity } = req.body;

    if (!id || id.length !== 24) {
      return sendRes(
        "Please don't modify id. It's an error.",
        [],
        401,
        false,
        res
      );
    }

    const order = await Order.findById(id);
    if (!order) {
      return sendRes("Order not found.", [], 404, false, res);
    }

    // Update fields directly
    order.customer.name = name || order.customer.name;
    order.product.discount = discount || order.product.discount;
    order.product.productName = productName || order.product.productName;
    order.product.productPrice = productPrice || order.product.productPrice;
    order.product.quantity = quantity || order.product.quantity;
    order.totalPrice =
      Number(order.product.productPrice) * Number(order.product.quantity);

    await order.save();

    return sendRes("Order updated successfully.", order, 200, true, res);
  } catch (error) {
    console.log(error);
    return sendRes("Internal server error", [], 500, false, res);
  }
});

/**
 * Get orders by status
 */
router.get("/status/:status", async (req, res) => {
  try {
    const { status } = req.params;
    const orders = await Order.find({ status }).sort({ createdAt: -1 });

    return sendRes("Orders fetched successfully", orders, 200, true, res);
  } catch (error) {
    console.error("Error fetching orders by status:", error);
    return sendRes("Internal server error", [], 500, false, res);
  }
});

/**
 * Get all orders with pagination, latest first
 * Query params: page, limit
 */
router.get("/", async (req, res) => {
  try {
    let { page, limit } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    const totalOrders = await Order.countDocuments();
    const orders = await Order.find()
      .skip(skip)
      .limit(limit)
      .sort({ updatedAt: -1 });

    return sendRes(
      "Orders fetched successfully",
      { totalOrders, page, limit, orders },
      200,
      true,
      res
    );
  } catch (error) {
    console.error("Error fetching orders:", error);
    return sendRes("Internal server error", [], 500, false, res);
  }
});

router.get("/getorder/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);

    if (!id || id.length !== 24) {
      return sendRes(
        "Please don't modify id. It's an error.",
        [],
        401,
        false,
        res
      );
    }

    const order = await Order.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "product.productId",
          foreignField: "_id",
          as: "result",
        },
      },
    ]);

    if (!order || order.length === 0) {
      return sendRes("Order not found", "", 404, false, res);
    }

    return sendRes("Product fetching successful.", order[0], 200, true, res);
  } catch (err) {
    console.log(err);
    return sendRes("Internal server error", [], 500, false, res);
  }
});

router.post("/send-email", async (req, res) => {
  try {
    const { id, subject, mailbody } = req.body;
    console.log(id, subject, mailbody);
    if (!id || !subject || !mailbody) {
      return sendRes(
        "Subject and Mailbody needs for send mail.",
        "",
        401,
        false,
        res
      );
    }

    // Fetch order
    const order = await Order.findById(id);
    if (!order) {
      return sendRes(
        "Order not found. retry by solving issues.",
        "",
        404,
        false,
        res
      );
    }

    // Build Order Table
    const orderTable = `
      <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%; text-align: center;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th>Name</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Discount</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${order?.customer?.name || "N/A"}</td>
            <td>${order?.product?.quantity || 0}</td>
            <td>₹${order?.product?.productPrice || 0}</td>
            <td>${order?.product?.discount || 0}%</td>
            <td>
              ₹${
                (Number(order?.product?.quantity) || 0) *
                  (Number(order?.product?.productPrice) || 0) -
                ((Number(order?.product?.quantity) || 0) *
                  (Number(order?.product?.productPrice) || 0) *
                  (Number(order?.product?.discount) || 0)) /
                  100
              }
            </td>
          </tr>
        </tbody>
      </table>
    `;

    // Final Mail Body
    const finalMailBody = `
      <div>
        <p>${mailbody}</p>
        <br/>
        ${orderTable}
        <br/>
        <p style="margin-top:20px; font-size: 14px; color: #555;">
          This email is from <b>DNS Technology</b>.<br/>
          You can contact us at: <a href="mailto:${process.env.NODEMAILER_USER}">${process.env.NODEMAILER_USER}</a>
        </p>
      </div>
    `;
    // Send mail
    const response = await sendMailBack(
      order?.customer?.email, // or order.customer.email if sending to customer
      subject,
      finalMailBody
    );

    console.log(response);
    if (!response.success) {
      return sendRes(
        response.message || "Failed to send mail. try again later",
        [],
        500,
        false,
        res
      );
    }

    return sendRes("Successfully sent mail.", [], 200, true, res);
  } catch (error) {
    console.log(error);
    return sendRes("Internal server error", [], 500, false, res);
  }
});

export default router;
