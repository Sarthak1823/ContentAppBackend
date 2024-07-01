const mongoose =require('mongoose');

const LinkSchema=new mongoose.Schema({
    "name":{
        type:String,
        required:true
    },
    "description":{
         type:String
    },
    "link":{
        type:String,
        required:true
   },
})
 
const linkModel=new mongoose.model('linkModel',LinkSchema);

module.exports={linkModel};