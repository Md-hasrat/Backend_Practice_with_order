import mongoose, { Schema } from "mongoose";

const productSchema = new Schema({
    itemName: {
        type: String,
        required: true
    },
    cost: {
        type: Number,
        required: true
    },
    stockQuantity: {
        type: Number,
        required: true
    },
    warehouseId: {
        type: mongoose.Types.ObjectId,
        ref: "warehouses",
        required: true
    }
})


const Product = mongoose.model("Product",productSchema)

export default Product
