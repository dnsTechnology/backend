import express from "express";
import { isAdmin } from "../middleware/adminCheck.js";
import {
  createCategory,
  createProduct,
  deleteCategory,
  deleteProduct,
  getAllCategoriesWithPagination,
  getCategoryById,
  getProductById,
  getProducts,
  updateCategory,
  updateProduct,
} from "../controllers/product.js";

const router = express.Router();

router.post("/create/category", isAdmin, createCategory);
router.put("/update/category/:id", isAdmin, updateCategory);
router.delete("/delete/category/:id", isAdmin, deleteCategory);
router.get("/category/all", getAllCategoriesWithPagination);
router.get("/category/:id", getCategoryById);

//also make routes for products also

router.post("/create", isAdmin, createProduct);
router.put("/update/:id", isAdmin, updateProduct);
router.delete("/delete/:id", isAdmin, deleteProduct);
router.get("/all", getProducts);
router.get("/:id", getProductById);
export default router;
