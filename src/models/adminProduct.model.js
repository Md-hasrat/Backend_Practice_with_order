import mongoose, { Schema } from "mongoose";


const adminProductSchema = new Schema({
      itemName: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true,
            min: [1,"Price should be atleast 1"],
        },
        stockQuantity: {
            type: Number,
            required: true
        },
        warehouseId: {
            type: mongoose.Types.ObjectId,
            ref: "sellerWarehouses",
            required: true
        }
})


const AdmnProduct = mongoose.model("AdmnProduct",adminProductSchema)


export default AdmnProduct