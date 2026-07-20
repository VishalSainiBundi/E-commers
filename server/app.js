const dotenv = require('dotenv')
dotenv.config(".env")
const express = require('express')
const cors = require('cors')
const { connectDB } = require('./connect_db')
const CategoryRouter = require('./routes/categoryRoute')
const ColorRouter  = require('./routes/colorRoute')
const BrandRouter=require('./routes/brandRoute')
const ProdutRoute=require('./routes/productRoute')
const UserRouter = require('./routes/userRoute')
const CartRouter= require('./routes/CartRouter')
const OrderRouter= require('./routes/OrderRouter')
const { verifyWebsiteUser } = require('./middleware/WebsiteAuth')
const Adminrouter=require('./routes/AdminRouter')
const wishRouter = require('./routes/wishRoute')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors({ origin: "http://localhost:3000" }))
app.use(express.static("public"))
app.use('/category', CategoryRouter);
app.use('/color', ColorRouter);
app.use('/brand',BrandRouter);
app.use('/product',ProdutRoute);
app.use('/user',UserRouter) ;
app.use('/cart',CartRouter)   
app.use('/order',verifyWebsiteUser,OrderRouter)  
app.use('/admin',Adminrouter)                                                                                                  
app.use('/wish',wishRouter)                                                                                                  



connectDB()
    .then(() => {
        console.log("connected",)
        app.listen(
            5000,
            () => {
                console.log("server started")
            }
        )
    }
    )

    .catch(
        () =>
            console.log("sever not a started")
    )
