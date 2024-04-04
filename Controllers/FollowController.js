const express=require("express");
const FollowRouter=express.Router();

FollowRouter.get("/check",(req, res)=>{
    console.log("working");
    return res.send("all ok");
})

module.exports=FollowRouter;