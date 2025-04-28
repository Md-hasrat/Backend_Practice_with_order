import { Router } from 'express'
import { createWarehouse, deleteWarehouse, getAnyParticularWarehouse, getWarehouseByadminId, updateWarehouse } from '../controllers/warehouse.controller.js'
import { isAdminLogedIn } from '../middleware/jwt.js'

const router = Router()

router.post("/createWarehouse",isAdminLogedIn,createWarehouse)
router.get("/getWarehouse",isAdminLogedIn,getWarehouseByadminId)
router.get("/getAnyParticularWarehouse",isAdminLogedIn,getAnyParticularWarehouse)
router.put("/updateWarehouse",isAdminLogedIn,updateWarehouse)
router.post("/deleteWarehouse",isAdminLogedIn,deleteWarehouse)

export default router
