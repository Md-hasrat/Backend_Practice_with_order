import Admin from "../models/admin.model.js";
import Product from "../models/product.model.js";
import Warehouse from "../models/warehouse.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";



export const createProduct = asyncHandler(async (req, res) => {
    const { itemName, cost, stockQuantity, warehouseId } = req.body;

    const adminId = req.adminId

    try {

        const admin = await Admin.findById(adminId)
        // console.log(admin);

        if (!admin || admin.role !== 'ADMIN') {
            throw new ApiError(404, "Admin not found or unauthorized!!!")
        }

        const warehouse = await Warehouse.findById(warehouseId)

        // console.log(warehouse);

        if (!warehouse) {
            throw new ApiError(404, "Warehouse not found!!!")
        }

        const newProduct = new Product({
            itemName,
            cost,
            stockQuantity,
            warehouseId
        })

        await newProduct.save()

        return res
            .status(201)
            .json(
                new ApiResponse(201, newProduct, "Warehouse created successfully!!!")
            )
    } catch (error) {
        throw new ApiError(404, "Error while creating warehouse" || error.message)
    }
})


export const getProduct = asyncHandler(async (req, res) => {

    const adminId = req.adminId

    try {
        const admin = await Admin.findById(adminId)

        if (!admin || admin.role !== "ADMIN") {
            throw new ApiError(404, "Admin not found or unauthorized!!!")
        }

        const allProduct = await Product.find();

        if (!allProduct) {
            throw new ApiError(404, "Product not found!!!")
        }

        return res
            .status(200)
            .json(
                new ApiResponse(200, allProduct, "Product fetched successfully!!!")
            )

    } catch (error) {
        throw new ApiError(404, "Error while fetching the product!!!", error.message)
    }
})


export const getAnyParticularProduct = asyncHandler(async (req, res) => {
    const adminId = req.adminId
    const { productId } = req.query;

    try {
        const admin = await Admin.findById(adminId)

        if (!admin || admin.role !== "ADMIN") {
            throw new ApiError(404, "Admin not found or unauthorized!!!")
        }

        const product = await Product.findById(productId)
        console.log(product);


        if (!product) {
            throw new ApiError(404, "Product not found!!!")
        }

        return res
            .status(200)
            .json(
                new ApiResponse(200, product, "Product fetched successfully!!!")
            )
    } catch (error) {
        throw new ApiError(404, "Error while fetching the Product!!!" || error.message)
    }
})


export const updateProduct = asyncHandler(async (req, res) => {

    const { itemName, cost, stockQuantity, productId } = req.body;

    const adminId = req.adminId
    // const {productId} = req.query;

    try {
        const admin = await Admin.findById(adminId)

        if (!admin || admin.role !== "ADMIN") {
            throw new ApiError(404, "Admin not found or unauthorized!!!")
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            {
                itemName,
                cost,
                stockQuantity
            },
            { new: true }
        )

        if (!updatedProduct) {
            throw new ApiError(404, "Product not found!!!")
        }

        return res
            .status(200)
            .json(
                new ApiResponse(200, updatedProduct, "Product fetched successfully!!!")
            )
    } catch (error) {
        throw new ApiError(404, "Error while updating the product!!!" || error.message)
    }
})


export const deleteProduct = asyncHandler(async (req, res) => {

    const adminId = req.adminId;
    const { productId } = req.body

    // console.log(productId);
    try {

        const admin = await Admin.findById(adminId)

        // console.log(admin);

        if (!admin || admin.role !== "ADMIN") {
            throw new ApiError(404, "Admin not found or unauthorized!!!")
        }

        const deletedProduct = await Product.findByIdAndDelete(productId)
        console.log(deletedProduct);

        if (!deletedProduct) {
            throw new ApiError(404, "Produc not found while deleting!!!")
        }

        return res
            .status(200)
            .json(
                new ApiResponse(200, deletedProduct, "Product deleted successfully!!!")
            )
    } catch (error) {
        throw new ApiError(404, "Error while deleting!!!" || error.message)
    }
})


