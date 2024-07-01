const mongoose=require('mongoose');

const connectDB=async ()=>{
         try{
              await mongoose.connect('mongodb+srv://Admin:Sarthak1823@cluster0.p6a06b2.mongodb.net');

              console.log("MongoDB connected successfully");
         }
         catch(err){
             console.log(`Error while connection MongoDB${err}`);
         }
}

module.exports = { connectDB };