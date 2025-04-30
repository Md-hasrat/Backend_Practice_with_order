import mongoose, { Schema } from "mongoose";

const sellerSchema = new Schema({
    sellerName: {
        type: String,
        unique: true,
        required: true
    },
    email:{
        type: String,
        unique: true,
        required: true
    },
    phone: {
        type: Number
    },
    address:{
        type: String
    },
    password: {
        type: String,
        required: true
    },
    accessToken: {
        type: String
    }
})


const Seller = mongoose.model("Seller",sellerSchema)

export default Seller