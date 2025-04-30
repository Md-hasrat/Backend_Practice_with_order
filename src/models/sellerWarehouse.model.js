import mongoose, { Schema } from "mongoose";

const sellerWrehouseSchema = new Schema({
      warehouseName:{
            type: String,
            required: true
        },
        address:{
            type: String,
            required: true
        },
        geoCoordinates: {
            type:{
                type: String,
                enum: ["Point"]
            },
            coordinates: {
                type: [Number]
            }
        },
        state:{
            type: String,
            required: true
        },
        createdBy:{
            type: mongoose.Types.ObjectId,
            ref: "sellers"
        }
})


const SellerWarehouse = mongoose.model("SellerWarehouse",sellerWrehouseSchema)

export default SellerWarehouse