import mongoose, { Schema } from "mongoose";

const amdinSchema = new Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role:{
        type: String,
        enum: ["USER","ADMIN"],
        default: "ADMIN"
    },
    accessToken: {
        type: String
    }
})


const Admin = mongoose.model("Admin",amdinSchema)

export default Admin
