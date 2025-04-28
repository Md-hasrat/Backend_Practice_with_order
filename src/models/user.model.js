import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    firstName:{
        type: String,
        required: true,
        unique: true
    },
    lastName: {
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        unique: true
    },
    canPurchase:{
            type: String,
            enum: ["ALLOWED","PENDING","DENIED"],
            default: "PENDING"
    },
    geoCoordinates: {
        type:{
            type: String,
            enum: ["Point"]
        },
        coordinate: {
            type: [Number]
        }
    },
    status:{
        type: String,
        enum: ["ACTIVE","INACTIVE"],
        default: "ACTIVE"
    },
    role:{
        type: String,
        enum: ["USER","ADMIN"],
        default: "USER"
    },
    accesToken:{
        type: String
    }
})


userSchema.index({geoCoordinates: "2dsphere"})

const User = mongoose.model("User",userSchema)

export default User
