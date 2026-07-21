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

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : ["http://localhost:3000"];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow server-to-server requests (no origin header) and listed origins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin ${origin} not allowed`));
      }
    },
    credentials: true,
  })
);
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
