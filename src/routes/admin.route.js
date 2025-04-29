
import express, { Router } from 'express'
import { adminLogin, adminSignUp, deleteUser, getAllUser, getOrderList, getUserOrder, updateStatus } from '../controllers/admin.controller.js';
import { isAdminLogedIn } from '../middleware/jwt.js';


const router = Router();

router.post('/signup',adminSignUp)
router.post('/login',adminLogin)
router.get('/getAllUser',isAdminLogedIn,getAllUser)
router.post('/updateStatus',isAdminLogedIn,updateStatus)
router.post('/deleteUser',isAdminLogedIn,deleteUser)
router.get('/getUserOrder',isAdminLogedIn,getUserOrder)
router.get('/getOrderList',isAdminLogedIn,getOrderList)


export default router