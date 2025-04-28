import Admin from "../models/admin.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'



export const adminSignUp = asyncHandler(async (req, res)=>{
    const {userName,email,password} = req.body;

    if(!userName || !email || !password){
        throw new ApiError(401,"All fields are required!!!")
    }

    try {
        const existingAdmin = await Admin.findOne({email})
    
        if(existingAdmin){
            throw new ApiError(401,"Admin aready exist!!!")
        }
    
        const hashPass = bcrypt.hashSync(password,10);
    
        const admin = new Admin({
            userName,
            email,
            password: hashPass
        })
    
        await admin.save()

        res
            .status(201)
            .json(
                new ApiResponse(201,admin,"Admin signup successfully!!!")
            )
    } catch (error) {
        throw new ApiError(401,error.message)
    }
})


export const adminLogin = asyncHandler(async(req, res)=>{
    const {email,password} = req.body;

    try {
        const existingAdmin = await Admin.findOne({email})

        if(!existingAdmin){
            throw new ApiError(401,"Amdin not exist!!!")
        }

        const isCorrectPass = bcrypt.compareSync(password,existingAdmin.password);
        if(!isCorrectPass){
            throw new ApiError(401,"Invalid credentials!!!")
        }

        // the adminId -----> which is pass from the controller is access with the same name in verify token in middleware files
        const token = jwt.sign({adminId: existingAdmin._id},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: "6h"}
        )

        existingAdmin.accessToken = token
        await existingAdmin.save()


        return res
            .status(200)
            .json(
                new ApiResponse(200,existingAdmin,"Admin login successfull!!")
            )
    } catch (error) {
        throw new ApiError(401,error.message)
    }
})