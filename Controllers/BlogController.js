const express=require("express");
const BlogDataValidation = require("../Utils/BlogUtil");
const User = require("../Models/UserModel");
const createBLog = require("../Models/BlogModel");

const BlogRouter=express.Router();

BlogRouter.post("/create-blog", async(req, res)=>{
     const{title, textBody}=req.body;
     const createDateTime= Date.now();
     const userId=req.session.user.userId;
     try {
        await BlogDataValidation({title, textBody});
        const userDb=await User.findUserWithkey({key:userId});
    
     } catch (error) {
        return res.send({
            status:400,
            message:error
        })
     }
     try {
        const blogDb=await createBLog({
            title,
            textBody,
            createDateTime,
            userId
        });
       return res.send({
         status:201,
         message:"Blog created successfully",
         data:blogDb
        })
     } catch (error) {
        return res.send({
            status :400,
            message:"Internal Server Error",
            error:error
        })
     }

})

BlogRouter.get("/get-blog", (req, res)=>{

})

module.exports=BlogRouter;