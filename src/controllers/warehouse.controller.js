 import Admin from "../models/admin.model.js";
import Warehouse from "../models/warehouse.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";



export const createWarehouse = asyncHandler(async(req, res)=>{

    const {warehouseName,address,geoCoordinates,state,} = req.body;
    const adminId = req.adminId

    try {
        if(!warehouseName || !address || !state){
            throw new ApiError(401,"All fields are required!!!")
        }

        const admin = await Admin.findById(adminId)

        if(!admin){
            throw new ApiError(404,"Admin not found!!!")
        }

        if(admin.role !== "ADMIN"){
            throw new ApiError(401,"Unauthorized")
        }

        // if(admin.createdBy  !== adminId){
        //     throw new ApiError(404,"unauthorized!!!")
        // }

        const newWarehouse = new Warehouse({
            warehouseName,
            address,
            geoCoordinates,
            state,
            createdBy: adminId
        })

        await newWarehouse.save()

        return res
            .status(201)
            .json(new ApiResponse(201,newWarehouse,"Warehouse created successfully!!!"))
    } catch (error) {
        throw new ApiError(404,error.message)
    }
})


export const getWarehouseByadminId = asyncHandler(async(req, res)=>{
    const adminId = req.adminId
    // const {warehouseId} = req.query
    // console.log("warehouseId",warehouseId);

    try {
        const admin = await Admin.findById(adminId)

        console.log("admin",admin);
        
        if(!admin){
            throw new ApiError(404,"Admin not found!!!")
        }

        if(admin.role !== "ADMIN"){
            throw new ApiError(401,"Unauthorized admin");
        }

        const warehouse = await Warehouse.find({createdBy: adminId})
        console.log(warehouse);
        
        if(!warehouse || warehouse.length === 0){
            throw new ApiError(404,"Warehouse not found for this admin!!!")
        }

        return res
            .status(200)
            .json(
                new ApiResponse(200,warehouse,"All warehouse fetch successfully!!!")
            )
    } catch (error) {
        throw new ApiError(401,error.message)
    }
})


export const getAnyParticularWarehouse = asyncHandler(async(req,res)=>{

    const adminId = req.adminId
    // const adminId = 6809dd55fa2fc6f1dc3ad9c9;

    const {warehouseId} = req.query

    // console.log(adminId);
    // console.log(warehouseId);
    
    try {
        const admin = await Admin.findById(adminId)
        // console.log(admin);
        

        if(!admin || admin.role !==  "ADMIN"){
            throw new ApiError(404,"Admin not found or unauthorized!!!")
        }

        const warehouse = await Warehouse.findById(warehouseId)

        if(!warehouse){
            throw  new ApiError(404,"Warehouse not found!!!")
        }

        if(warehouse.length === 0){
            throw new ApiError(404,"No warehouse is created!!!")
        }

        return res
            .status(200)
            .json(
                new ApiResponse(200,warehouse,"Particular warehouse fetched successfully!!!")
            )
    } catch (error) {
        throw new ApiError(404,error.message || "Warehouse not found!!!")
    }
})


export const updateWarehouse = asyncHandler(async (req,res)=>{
    const {warehouseName,address,geoCoordinates,state} = req.body
    const adminId = req.adminId;
    const {warehouseId} = req.query

    try {
        const admin = await Admin.findById(adminId)

        if(!admin || admin.role !== "ADMIN"){
            throw new ApiError(404,"Admin not found or unauthorized!!!")
        }

        const newWarehouse = await Warehouse.findByIdAndUpdate(
            warehouseId,
            {
                warehouseName,
                address,
                geoCoordinates,
                state
            },
            {new: true}
        )

        return res
            .status(200)
            .json(
                new ApiResponse(200,newWarehouse,"Warehouse updated successfully!!!")
            )
    } catch (error) {
        throw new ApiError(404,error.message || "Error while updating the warehouse data!!!")
    }
})


export const deleteWarehouse = asyncHandler(async(req,res)=>{
    const {warehouseId} = req.body
    const adminId = req.adminId

    try {
        const admin = await Admin.findById(adminId)

        if(!admin || admin.role !== 'ADMIN'){
            throw new ApiError(404,"Admin not found or unauthorized!!!")
        }

        const deleteWarehouse = await Warehouse.findByIdAndDelete(warehouseId)

        if(!deleteWarehouse){
            throw new ApiError(404,"Warehouse not found!!!")
        }

        return res
            .status(200)
            .json(new ApiResponse(200,{}, "Warehouse deleted successfully!!!"))
    } catch (error) {
        throw new ApiError(404,error.message || "Error while deleting the warehouses!!!")    
    }
})