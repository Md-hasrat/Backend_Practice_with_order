import Admin from "../models/admin.model.js";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'



export const adminSignUp = asyncHandler(async (req, res) => {
    const { userName, email, password } = req.body;

    if (!userName || !email || !password) {
        throw new ApiError(401, "All fields are required!!!")
    }

    try {
        const existingAdmin = await Admin.findOne({ email })

        if (existingAdmin) {
            throw new ApiError(401, "Admin aready exist!!!")
        }

        const hashPass = bcrypt.hashSync(password, 10);

        const admin = new Admin({
            userName,
            email,
            password: hashPass
        })

        await admin.save()

        res
            .status(201)
            .json(
                new ApiResponse(201, admin, "Admin signup successfully!!!")
            )
    } catch (error) {
        throw new ApiError(401, error.message)
    }
})


export const adminLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingAdmin = await Admin.findOne({ email })

        if (!existingAdmin) {
            throw new ApiError(401, "Amdin not exist!!!")
        }

        const isCorrectPass = bcrypt.compareSync(password, existingAdmin.password);
        if (!isCorrectPass) {
            throw new ApiError(401, "Invalid credentials!!!")
        }

        // the adminId -----> which is pass from the controller is access with the same name in verify token in middleware files
        const token = jwt.sign({ adminId: existingAdmin._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "6h" }
        )

        existingAdmin.accessToken = token
        await existingAdmin.save()


        return res
            .status(200)
            .json(
                new ApiResponse(200, existingAdmin, "Admin login successfull!!")
            )
    } catch (error) {
        throw new ApiError(401, error.message)
    }
})


export const getAllUser = asyncHandler(async (req, res) => {

    const adminId = req.adminId
    try {
        const admin = await Admin.findById(adminId)

        if (!admin) {
            throw new ApiError(404, "Admin not found!!!")
        }

        if (admin.role !== "ADMIN") {
            throw new ApiError(404, "Unauthorized")
        }

        const page = Number(req.query.page) || 1;
        const pageSize = Number(req.query.limit) || 10;
        const search = req.query.search || "";


        const searchCondition = {
            $or: [
                { firstName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } }

            ]
        }

        const totalUser = await User.countDocuments(searchCondition)

        // Get total pages and limit to a maximum of 10
        const totalPage = Math.min(Math.ceil(totalUser / pageSize), 10)

        // Apply search filter and paginate users
        const users = await User.find(searchCondition)
            .skip((page - 1) * pageSize)
            .limit(pageSize)

        return res.status(200).json(
            new ApiResponse(200,
                users,
                {
                    pagination: {
                        totalPage,
                        totalUser,
                        currentPage: page,
                        pageSize
                    }
                }
            )
        )

    } catch (error) {
        throw new ApiError(404, error.message || "Error while find the all user by admin!!!")
    }
})


export const updateStatus = asyncHandler(async (req, res) => {

    const adminId = req.adminId

    try {
        const admin = await Admin.findById(adminId)

        if (!admin) {
            throw new ApiError(404, "Admin not found!!!")
        }

        if (admin.role !== "ADMIN") {
            throw new ApiError(404, "Unauthorized admin!!!")
        }

        const { approvedStatus, userId } = req.body;

        const user = await User.findById(userId)

        if (!user) {
            throw new ApiError(404, "User not found!!!")
        }

        if (!["ALLOWED", "DENIED"]) {
            throw new ApiError(404, "Invalid approved status!!!")
        }

        user.canPurchase = approvedStatus
        await user.save()

        return res
            .status(200)
            .json(
                new ApiResponse(200, user, "User status has been changed!!!")
            )
    } catch (error) {
        throw new ApiError(404, error.message || "Unauthorized admin!!!")
    }
})


 

