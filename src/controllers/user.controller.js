import mongoose from "mongoose";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'



export const usreSingUp = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, phone, password, geoCoordinates } = req.body;

    try {

        if (!firstName || !lastName || !email || !phone || !password) {
            throw new ApiError(401, "All fields are required!!!")
        }
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            throw new ApiError(401, "User already exist!!")
        }

        const hashPass = bcrypt.hashSync(password, 10)

        const user = new User({
            firstName,
            lastName,
            email,
            phone,
            password: hashPass,
            geoCoordinates
        })

        await user.save()

        return res
            .status(201)
            .json(
                new ApiResponse(201, user, "User signup successfully!!!")
            )

    } catch (error) {
        throw new ApiError(401, error.message)
    }
})


export const userLogin = asyncHandler(async (req, res) => {

    const { emailOrPhone, password } = req.body

    try {

        const existingUser = await User.findOne({
            $or: [{ email: emailOrPhone }, { phone: emailOrPhone }]
        })

        if (!existingUser) {
            throw new ApiError(401, "User not found!!!")
        }

        const isCorrectPass = bcrypt.compareSync(password, existingUser.password)

        if (!isCorrectPass) {
            throw new ApiError(401, "Invalid credentials")
        }

        const token = jwt.sign(
            { userId: existingUser._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "6h" }
        )

        existingUser.accesToken = token
        await existingUser.save()

        return res
            .status(201)
            .json(
                new ApiResponse(201, existingUser, "User login successfully!!!")
            )
    } catch (error) {
        throw new ApiError(401, error.message)
    }
})


export const placeOrder = asyncHandler(async (req, res) => {

    const { productId, quantity } = req.body
    const userId = req.userId

    try {
        const user = await User.findById(userId)

        if (!user) {
            throw new ApiError(404, "User not found!!!")
        }

        const product = await Product.findById(productId)

        if (!product) {
            throw new ApiError(404, "Product not found!!!")
        }

        if (product.stockQuantity < quantity) {
            throw new ApiError(404, "Product is out of stock!!!")
        }

        const price = product.cost;
        const totalPrice = price * quantity

        const newOrder = new Order({
            userId,
            productId,
            quantity,
            price,
            totalPrice: totalPrice,
        })

        await newOrder.save()

        const newStock = product.stockQuantity - quantity
        product.stockQuantity = newStock
        await product.save()

        return res
            .status(200)
            .json(
                new ApiResponse(200, newOrder, "Order placed successfully!!!")
            )

    } catch (error) {
        throw new ApiError(404, error.message || "Error while placing order!!!")
    }
})

export const getOrder = asyncHandler(async (req, res) => {
    const { orderId } = req.query;
    const userId = req.userId

    // console.log(orderId);
    // console.log(userId);

    try {
        if (!orderId) {
            throw new ApiError(404, "Order Id is neccessary for product detail!!!")
        }

        // console.log("Checking if Order exists...");
        // const orderExist = await Order.findOne({ _id: new mongoose.Types.ObjectId(orderId) });
        // console.log(orderExist);

        const order = await Order.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(orderId),
                    userId: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "productId",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },
            {
                $unwind: "$productDetails"
            },
            {
                $project: {
                    _id: 1,
                    productId: 1,
                    quantity: 1,
                    totalPrice: 1,
                    itemName: "$productDetails.itemName",
                    cost: "$productDetails.cost"
                }
            }
        ])

        // console.log(order);

        if (!order.length) {
            throw new ApiError(404, "Order not found!!!")
        }

        return res
            .status(200)
            .json(
                new ApiResponse(200, order[0], "Order fetched successfully!!!")
            )

    } catch (error) {
        throw new ApiError(404, error.message)
    }
})


