const express=require("express");
const User = require("../Models/userModel");
const { followUser, getFollowerList, getFollowingList, unfollowUser } = require("../Models/FollowModel");
const FollowRouter=express.Router();

FollowRouter.post("/follow-user",async(req, res)=>{
     const followerUserId=req.session.user.userId;
     const followingUserId=req.body.followingUserId;
        if(followerUserId.equals(followingUserId)){
            return res.send({
                status:400,
                message:"follower and following User Id can not be same"
            })
        }
     try {
        const follwerExist= await User.findUserWithkey({key:followerUserId})
        // console.log(follwerExist)
     } catch (error) {
        return res.send({
            status:400,
            message:"Follower userId not found",
            error:error
        })
     }
     try {
        const follwingExist= await User.findUserWithkey({key:followingUserId})
        // console.log(follwingExist)
     } catch (error) {
        return res.send({
            status:400,
            message:"Following userId not found",
            error:error
        })
     }
     try {
        const followDb=await followUser({followerUserId, followingUserId});
        console.log(followDb);
        return res.send({
            status:201, 
            message:"Follow successfull",
            data:followDb
        })
     } catch (error) {
        // console.log(error);
        return res.send({
            status:500,
            message:"Internal Server Error",
            error:error
        })
     }
    
})

FollowRouter.get("/follower-list", async(req, res)=>{
    const followingUserId=req.session.user.userId
    const SKIP=Number(req.query.skip) || 0;

    try {
        const followerList=await getFollowerList({followingUserId, SKIP});
        console.log(followerList);
        return res.send({
            status:200,
            message:"follower fetched successfully",
            data:followerList
        })
    } catch (error) {
        return res.send({
            status:500,
            message:"Internal Server Error",
            error:error
        })
    }
})

FollowRouter.get("/following-list", async(req, res)=>{
    const followerUserId=req.session.user.userId
    const SKIP=Number(req.query.skip) || 0;

    try {
        const followingList=await getFollowingList({followerUserId, SKIP});
        console.log(followingList);
        return res.send({
            status:200,
            message:"following fetched successfully",
            data:followingList
        })
    } catch (error) {
        return res.send({
            status:500,
            message:"Internal Server Error",
            error:error
        })
    }
})

FollowRouter.post("/unfollow-user", async(req, res)=>{
     const followerUserId=req.session.user.userId;
     const followingUserId=req.body.followingUserId;
     if(followerUserId.equals(followingUserId)){
        return res.send({
            status:400,
            message:"follower and following User Id can not be same"
        })
    }
    try {
        const unfollowDb=await unfollowUser({followerUserId,followingUserId});
        console.log(unfollowDb);
        return res.send({
            status:200,
            message:"Unfollow Successfully"
        })
    } catch (error) {
        return res.send({
            status:500,
            message:"Internal Server Error",
            error:error
        })
    }
})

module.exports=FollowRouter;