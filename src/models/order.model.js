import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "users",
        required: true
    },
    productId: {
        type: mongoose.Types.ObjectId,
        ref: "products",
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    orderStatus: {
        type: String,
        enum: ["Pending", "Accepted", "Rejected"],
        default: "Pending"
    }
})


const Order = mongoose.model("Order", orderSchema)

export default Order