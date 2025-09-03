import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    category: {
      type: mongoose.Schema.Types.ObjectId, // ✅ FIXED
      ref: "ProductCategory",
    },
    brand: { type: String },
    image: { type: String }, // single main image
    isActive: { type: Boolean, default: true },
    discount: { type: Number, default: 0 },
    author: {
      type: mongoose.Schema.Types.ObjectId, // ✅ FIXED
      ref: "User",
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
