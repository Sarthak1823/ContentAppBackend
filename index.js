const express=require('express');
const cors=require('cors');
const axios = require('axios');
const {connectDB} =require('./database')
const {linkModel} =require('./linkModel')
const {subjectModel}    =require("./subjectModel")
 const {userModel}= require("./userModel");
const app=express();

const port=4000;

app.use(express.json());
app.use(cors());

app.get("/",(req,res)=>{
    res.send("Helo World");
})

app.post('/api/add', async (req, res) => {
    const { name, description, link } = req.body;

    try {
        const response = await axios.get(link);
        
        if (response.status === 200) {
            const newMeme = new linkModel({ name, description, link });
            await newMeme.save();
           return  res.status(201).json({ message: 'Content added' });
        } else {
          return   res.status(400).json({ message: 'Link is not accessible' });
        }
    } catch (error) {
         return   res.status(400).json({ message: 'Error while adding content', error: error.message });
    }
});


app.post('/api/memes',async (req,res)=>{
    try {
        const memes = await linkModel.find({});
       return  res.status(201).json(memes);
      } catch (err) {
      return  res.status(500).send('Error fetching memes');
      }
})

app.post('/api/addStudy', async (req, res) => {
    const { name, subject, description, link ,pdfUrl} = req.body;
  
    try {
        const studyMaterial = new subjectModel({
            "name":name,
            "subject":subject,
            "description":description,
            "link":link,
            "pdf":pdfUrl
        });
        await studyMaterial.save();
        return res.status(201).send({ message: "Study Material added successfully!!" });
    } catch (error) {
        // console.error("Error while uploading study material:", error);
        return res.status(400).json({ message: "Error while uploading study material", error: error.message });
    }
});

app.get('/api/study',async (req,res)=>{
    try {
        const studyMaterial = await subjectModel.find({});
       return  res.status(201).json(studyMaterial);
      } catch (err) {
      return  res.status(500).send('Error fetching Study Material');
      }
})

app.post('/api/deletestudy', async (req,res)=>{
       const {id}=req.body;
      
       try{
      await subjectModel.findByIdAndDelete(id);
      const studyMaterial = await subjectModel.find({});
       return res.status(200).json({message:"Deleted successfully!!",studyMaterial});
       
       }
        catch(error){
            return res.status(400).json({message:"Error while deleting!!"})
        }
})

app.post ('/api/deletememes',async (req,res)=>{
     const {id}=req.body;
      console.log(id);
       try{
         await linkModel.findByIdAndDelete(id);
         const memes = await linkModel.find({});
         return   res.status(200).send({message:"Meme deleted successfully!!",memes});
       }
       catch(error){
           return res.status(401).send({message:"Error while deleting memes",error});
       }
})

app.post('/api/filter', async (req, res) => {
    const { filterSubject, filterCategory } = req.body;
    console.log(filterSubject, filterCategory );
    let query = {};
  
    if (filterSubject !== "All Subjects" && filterCategory !== "All Categories") {
      query = { subject: filterSubject, description: filterCategory };
    } else if (filterSubject !== "All Subjects") {
      query = { subject: filterSubject };
    } else if (filterCategory !=="All Categories") {
      query = { description: filterCategory };
    }
  
    try {
    
      const studyMaterial = await subjectModel.find(query);
      
      res.status(200).json({ studyMaterial });
    } catch (err) {
      console.error("Error while fetching filtered study materials:", err);
      res.status(400).json({ message: "Error while fetching filtered study materials" });
    }
  });
  
app.post('/api/register',async (req,res)=>{
  const {name,email,password}=req.body;
   console.log(name,email,password);
   try{
    const user=await userModel.findOne({email:email});
     if (user){
      return res.status(201).send({message:"User already Registered"});
     }
   await userModel.create({
    "name":name,
    "email":email,
    "password":password
    })
     return res.status(201).send({message:"User Registered"});
  }
  catch(err){
      console.log(err);
       return res.status(400).send({message:"Error while registering user"});
  }

})

app.post("/api/login",async (req,res)=>{
      const {email,password}=req.body;
      try{
          const user=await userModel.findOne({email:email});
          console.log("User found:", user);
           if (user){
            if (user.password!=password)
              return res.status(401).send({message:"Invalid password"});
           }
            else {
              return res.status(401).send({message:"User not exists"});
            
            }
         return  res.status(201).send({message:"User logged in successfully"});
      }
      catch(err){
         return res.status(401).send({message:"Error while logging in"});
      }
})
app.listen(port,()=>{
     console.log(`Server is listening at http://localhost:${port}`);
})

connectDB();