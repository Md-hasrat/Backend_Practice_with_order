import express, { Router } from 'express'
import { getOrder, placeOrder, userLogin, usreSingUp } from '../controllers/user.controller.js'
import { isUserLogedIn } from '../middleware/jwt.js'

const router = Router()

router.post('/signup',usreSingUp)
router.post('/login',userLogin)
router.post('/placeOrder',isUserLogedIn,placeOrder)
router.get('/getOrder',isUserLogedIn,getOrder)


export default router