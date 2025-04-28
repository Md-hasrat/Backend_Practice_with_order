
import express, { Router } from 'express'
import { adminLogin, adminSignUp } from '../controllers/admin.controller.js';


const router = Router();

router.post('/signup',adminSignUp)
router.post('/login',adminLogin)


export default router