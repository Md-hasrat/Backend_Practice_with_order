import express, { Router } from "express";
import { login, signup } from "../controllers/seller.controller.js";


const router = Router()


router.post("/sellerSign",signup)
router.post("/sellerLogin",login)

export default router