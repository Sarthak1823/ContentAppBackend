const mongoose  =require("mongoose");
 
const StudySchema = new mongoose.Schema(
    {
        "name":{
          type:String,
          required:true
        },
        "subject":{
          type:String,
          required:true
        },
        "description":{
          type:String,
          required:true
        },
        "link":{
          type:String
        },
        "pdf":{
          type:String
        }
    }
)

 const subjectModel= new mongoose.model("subjectModel",StudySchema);

 module.exports = {subjectModel} ;