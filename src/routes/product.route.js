import express, { Router } from "express";
import { isAdminLogedIn } from "../middleware/jwt.js";
import { createProduct, deleteProduct, getAnyParticularProduct, getProduct, updateProduct } from "../controllers/product.controller.js";


const router = Router();

router.post("/createProduct",isAdminLogedIn,createProduct)
router.get("/getProduct",isAdminLogedIn,getProduct)
router.get("/getAnyParticularProduct",isAdminLogedIn,getAnyParticularProduct)
router.put("/updateProduct",isAdminLogedIn,updateProduct)
router.post("/deleteProduct",isAdminLogedIn,deleteProduct)


export default router