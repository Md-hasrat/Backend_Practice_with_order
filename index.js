import express from 'express'
import dotenv from 'dotenv/config'
import connectDb from './src/db/dbConnection.js'
import adminRoute from './src/routes/admin.route.js'
import userRoute from './src/routes/user.route.js'
import warehouseRoute from './src/routes/warehouse.route.js'
import productRoute from './src/routes/product.route.js'
import sellerRoute from './src/routes/seller.route.js'


const app = express()

connectDb()

app.use(express.json())
app.use(express.urlencoded({extends:true}))

app.get('/',(req,res)=>{
    res.send('Hello World!!!')
})


app.use('/api/admin',adminRoute)
app.use('/api/user',userRoute)
app.use('/api/warehouse',warehouseRoute)
app.use('/api/product',productRoute)
app.use('/api/seller',sellerRoute)

app.listen(3000,()=>{
    console.log('Server is running on port 3000');
})