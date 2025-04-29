
import express, { Router } from 'express'
import { adminLogin, adminSignUp, deleteUser, getAllUser, updateStatus } from '../controllers/admin.controller.js';
import { isAdminLogedIn } from '../middleware/jwt.js';


const router = Router();

router.post('/signup',adminSignUp)
router.post('/login',adminLogin)
router.get('/getAllUser',isAdminLogedIn,getAllUser)
router.post('/updateStatus',isAdminLogedIn,updateStatus)
router.post('/deleteUser',isAdminLogedIn,deleteUser)


export default router