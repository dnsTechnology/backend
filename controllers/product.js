import mongoose from "mongoose";
import { ProductCategory } from "../models/category.js";
import Product from "../models/product.js";
import { sendRes } from "../utils/utils.js";

export const createCategory = async (req, res) => {
  try {
    const { name, image, description } = req.body;

    if (!name || !image) {
      return sendRes("All fields are required", "", 400, false, res);
    }
    const user = req?.user;
    if (!user) return sendRes("User not found", "", 404, false, res);
    const authorId = new mongoose.Types.ObjectId(user._id);
    const categoryExists = await ProductCategory.findOne({ name });
    if (categoryExists) {
      return sendRes("Category already exists", "", 400, false, res);
    }
    const category = await ProductCategory.create({
      name,
      image,
      description,
      author: new mongoose.Types.ObjectId(authorId),
    });
    return sendRes("Category created successfully", category, 201, true, res);
  } catch (error) {
    console.log(error);
    sendRes(error.message, "", 500, false, res);
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;
    if (!name) {
      return sendRes("All fields are required", "", 400, false, res);
    }
    const user = req.user;
    if (!user) return sendRes("User not found", "", 404, false, res);
    const categoryExists = await ProductCategory.findOne({ name });
    if (categoryExists && categoryExists._id.toString() !== req.params.id) {
      return sendRes("Category already exists", "", 400, false, res);
    }
    const authorId = new mongoose.Types.ObjectId(user._id);
    await ProductCategory.findByIdAndUpdate(req.params.id, {
      name,
      image,
      description,
      status,
      author: new mongoose.Types.ObjectId(authorId),
    });
    return sendRes("Category updated successfully", "", 200, true, res);
  } catch (error) {
    console.log(error);
    sendRes(error.message, "", 500, false, res);
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return sendRes("User not found", "", 404, false, res);
    const category = await ProductCategory.findByIdAndDelete(req?.params?.id);
    if (!category) return sendRes("Category not found", "", 404, false, res);
    return sendRes("Category deleted successfully", "", 200, true, res);
  } catch (error) {
    console.log(error);
    sendRes(error.message, "", 500, false, res);
  }
};

export const getAllCategoriesWithPagination = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const categories = await ProductCategory.find()
      .skip(skip)
      .limit(limit)
      .populate("author", "name")
      .sort({ createdAt: -1 });
    const totalCategories = await ProductCategory.countDocuments();
    const totalPages = Math.ceil(totalCategories / limit);
    return sendRes(
      "Categories fetched successfully",
      {
        categories,
        totalPages,
        currentPage: page,
      },
      200,
      true,
      res
    );
  } catch (error) {
    console.log(error);
    sendRes(error.message, "", 500, false, res);
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const category = await ProductCategory.findById(req.params.id).populate(
      "author",
      "name"
    );
    if (!category) return sendRes("Category not found", "", 404, false, res);
    return sendRes("Category fetched successfully", category, 200, true, res);
  } catch (error) {
    console.log(error);
    sendRes(error.message, "", 500, false, res);
  }
};

// ✅ Create Product
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      stock,
      category,
      brand,
      image,
      discount,
    } = req.body;

    // Check required fields
    if (!name || !description || !price || !category || !image) {
      return sendRes(
        "Name, description, price, and category are required",
        "",
        400,
        false,
        res
      );
    }

    // Check user
    const user = req?.user;
    if (!user) return sendRes("User not found", "", 404, false, res);

    // Validate category
    if (!mongoose.Types.ObjectId.isValid(category)) {
      return sendRes("Invalid category ID", "", 400, false, res);
    }
    const categoryExists = await ProductCategory.findById(category);
    if (!categoryExists)
      return sendRes("Category not found", "", 404, false, res);

    // Create product
    const product = await Product.create({
      name,
      description,
      price,
      stock,
      category: new mongoose.Types.ObjectId(category),
      brand,
      image,
      discount,
      author: new mongoose.Types.ObjectId(user._id),
    });

    return sendRes("Product created successfully", product, 201, true, res);
  } catch (error) {
    console.error(error);
    sendRes(error.message, "", 500, false, res);
  }
};

// ✅ Get All Products
export const getProducts = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;

    // Convert to numbers
    page = parseInt(page);
    limit = parseInt(limit);

    if (page < 1 || limit < 1) {
      return sendRes("Invalid pagination values", "", 400, false, res);
    }

    const skip = (page - 1) * limit;

    // Get total count
    const totalProducts = await Product.countDocuments();

    // Fetch paginated products
    const products = await Product.find()
      .populate("category")
      .populate("author", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalProducts / limit);

    return sendRes(
      "Products fetched successfully",
      {
        products,
        pagination: {
          totalProducts,
          totalPages,
          currentPage: page,
          limit,
        },
      },
      200,
      true,
      res
    );
  } catch (error) {
    console.error(error);
    sendRes(error.message, "", 500, false, res);
  }
};

// ✅ Get Single Product
export const getProductById = async (req, res) => {
  console.log("Hiiii");
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendRes("Invalid product ID", "", 400, false, res);
    }

    const product = await Product.findById(id)
      .populate("category")
      .populate("author", "name email");

    if (!product) return sendRes("Product not found", "", 404, false, res);

    return sendRes("Product fetched successfully", product, 200, true, res);
  } catch (error) {
    console.error(error);
    sendRes(error.message, "", 500, false, res);
  }
};

// ✅ Update Product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { category } = req.body;

    // Validate product ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendRes("Invalid product ID", "", 400, false, res);
    }

    // Check user
    const user = req?.user;
    if (!user) return sendRes("User not found", "", 404, false, res);

    // Validate category if updating
    if (category && !mongoose.Types.ObjectId.isValid(category)) {
      return sendRes("Invalid category ID", "", 400, false, res);
    }
    if (category) {
      const categoryExists = await ProductCategory.findById(category);
      if (!categoryExists)
        return sendRes("Category not found", "", 404, false, res);
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { ...req.body, author: new mongoose.Types.ObjectId(user._id) },
      { new: true, runValidators: true }
    )
      .populate("category")
      .populate("author", "name email");

    if (!product) return sendRes("Product not found", "", 404, false, res);

    return sendRes("Product updated successfully", product, 200, true, res);
  } catch (error) {
    console.error(error);
    sendRes(error.message, "", 500, false, res);
  }
};

// ✅ Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendRes("Invalid product ID", "", 400, false, res);
    }

    // Check user
    const user = req?.user;
    if (!user) return sendRes("User not found", "", 404, false, res);

    const product = await Product.findByIdAndDelete(id);
    if (!product) return sendRes("Product not found", "", 404, false, res);

    return sendRes("Product deleted successfully", product, 200, true, res);
  } catch (error) {
    console.error(error);
    sendRes(error.message, "", 500, false, res);
  }
};
