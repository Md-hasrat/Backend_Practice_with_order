import mongoose, { Schema } from "mongoose";


const warehouseSchema = new Schema({
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
        ref: "admins"
    }
})


warehouseSchema.index({geoCoordinates: "2dsphere"})

const Warehouse = mongoose.model("Warehouse",warehouseSchema)

export default Warehouse
