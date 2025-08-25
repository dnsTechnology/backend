import mongoose from "mongoose";
import { sendRes } from "../utils/utils.js";
import Blog from "../models/blog.js";
import Category from "../models/category.js";

export const createBlog = async (req, res) => {
  try {
    const { title, description, category, tags, image } = req.body;
    if (!title || !description || !category || !image) {
      return sendRes("All fields are required", "", 400, false, res);
    }

    const user = req.user;
    if (!user)
      return sendRes("User not found. unauthorized user.", "", 404, false, res);
    const authorId = new mongoose.Types.ObjectId(user._id);
    const blog = await Blog.create({
      title,
      description,
      category,
      tags,
      featuredImage: image,
      author: new mongoose.Types.ObjectId(authorId),
      status: "published",
    });
    return sendRes("Blog created successfully", blog, 201, true, res);
  } catch (error) {
    console.log(error);
    sendRes(error.message, "", 500, false, res);
  }
};

export const updateBlog = async (req, res) => {
  try {
    const { title, description, category, tags, featuredImage } = req.body;
    if (!title || !description || !category || !featuredImage) {
      return sendRes("All fields are required", "", 400, false, res);
    }
    const user = req.user;
    if (!user) return sendRes("User not found", "", 404, false, res);
    const authorId = new mongoose.Types.ObjectId(user._id);
    await Blog.findByIdAndUpdate(req.params.id, {
      title,
      description,
      category,
      tags,
      featuredImage,
      author: authorId,
      status: "published",
    });
    return sendRes("Blog updated successfully", "", 200, true, res);
  } catch (error) {
    console.log(error);
    sendRes(error.message, "", 500, false, res);
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return sendRes("User not found", "", 404, false, res);
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return sendRes("Blog not found", "", 404, false, res);
    return sendRes("Blog deleted successfully", "", 200, true, res);
  } catch (error) {
    console.log(error);
    sendRes(error.message, "", 500, false, res);
  }
};

export const getAllBlogsWithPagination = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const blogs = await Blog.find()
      .skip(skip)
      .limit(limit)
      .populate("author", "name");
    const totalBlogs = await Blog.countDocuments();
    const totalPages = Math.ceil(totalBlogs / limit);
    return sendRes(
      "Blogs fetched successfully",
      {
        blogs,
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

export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("author", "name");
    if (!blog) return sendRes("Blog not found", "", 404, false, res);
    return sendRes("Blog fetched successfully", blog, 200, true, res);
  } catch (error) {
    console.log(error);
    sendRes(error.message, "", 500, false, res);
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return sendRes("All fields are required", "", 400, false, res);
    }
    const user = req?.user;
    if (!user) return sendRes("User not found", "", 404, false, res);
    const authorId = new mongoose.Types.ObjectId(user._id);
    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      return sendRes("Category already exists", "", 400, false, res);
    }
    const category = await Category.create({
      name,
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
    console.log(req.body);
    console.log("hiiii");
    const { name, description } = req.body;
    console.log(req.params.id);
    console.log(name, description);
    if (!name) {
      return sendRes("All fields are required", "", 400, false, res);
    }
    const user = req.user;
    if (!user) return sendRes("User not found", "", 404, false, res);
    const categoryExists = await Category.findOne({ name });
    if (categoryExists && categoryExists._id.toString() !== req.params.id) {
      return sendRes("Category already exists", "", 400, false, res);
    }
    const authorId = new mongoose.Types.ObjectId(user._id);
    await Category.findByIdAndUpdate(req.params.id, {
      name,
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
    const category = await Category.findByIdAndDelete(req.params.id);
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
    const categories = await Category.find()
      .skip(skip)
      .limit(limit)
      .populate("author", "name")
      .sort({ createdAt: -1 });
    const totalCategories = await Category.countDocuments();
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
    const category = await Category.findById(req.params.id).populate(
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
