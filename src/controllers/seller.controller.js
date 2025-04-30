import Seller from "../models/seller.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"



export const signup = asyncHandler(async(req,res)=>{
    const {sellerName,email,phone,password} = req.body;

    try {
        if(!sellerName || !email || !phone || !password){
            throw new ApiError(404,"All fields are required!!!")
        }

        const existingSeller = await Seller.findOne({email})

        if(existingSeller){
            throw new ApiError(404,"Seller already exist!!!")
        }

        const hashPass = bcrypt.hashSync(password,10);

        const newSeller = new Seller({
            sellerName,
            email,
            phone,
            password: hashPass
        })

        await newSeller.save()

        return res
            .status(201)
            .json(
                new ApiResponse(201,newSeller,"Seller created successfully!!!")
            )

    } catch (error) {
        throw new ApiError(404,error.message || "Error while creating the seller!!!")
    }
})


export const login = asyncHandler(async(req,res)=>{
    const  {email,password} = req.body

    if(!email || !password){
        throw new ApiError(404,"Email or Password is required!!!")
    }

    try {
        const existingSeller = await Seller.findOne({email})

        if(!existingSeller){
            throw new ApiError(404,"Seller does not existed!!!")
        }

        const isCorrectPass = bcrypt.compareSync(password,existingSeller.password)

        if(!isCorrectPass){
            throw new ApiError(401,"Invalid credentials!!!")
        }

        const token = jwt.sign(
            {sellerId: existingSeller._id},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: "6h"}
        )

        existingSeller.accessToken = token
        await existingSeller.save()

        return res.status(200).json(
            new ApiResponse(200,existingSeller,"Seller logedin successfully!!!")
        )

    } catch (error) {
        throw new ApiError(401,error.message || "Error while login the seller!!!")
    }
})