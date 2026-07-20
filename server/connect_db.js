const mongoose =require('mongoose')

const connectDB=()=>{
return mongoose.connect(
process.env.MONGODB_URI,
{
    dbName:process.env.DB_NAME
}
)


}
module.exports ={connectDB}