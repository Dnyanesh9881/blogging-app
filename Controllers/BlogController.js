const express = require("express");
const BlogDataValidation = require("../Utils/BlogUtil");
const User = require("../Models/UserModel");
const {createBLog, getAllBlogs, getMyBlogs} = require("../Models/BlogModel");

const BlogRouter = express.Router();

BlogRouter.post("/create-blog", async (req, res) => {
  const { title, textBody } = req.body;
  const createDateTime = Date.now();
  const userId = req.session.user.userId;
  try {
    await BlogDataValidation({ title, textBody });
    const userDb = await User.findUserWithkey({ key: userId });
  } catch (error) {
    return res.send({
      status: 400,
      message: error,
    });
  }
  try {
    const blogDb = await createBLog({
      title,
      textBody,
      createDateTime,
      userId,
    });
    return res.send({
      status: 201,
      message: "Blog created successfully",
      data: blogDb,
    });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Internal Server Error",
      error: error,
    });
  }
});

BlogRouter.get("/get-blog", async (req, res) => {
    const SKIP=Number(req.query.skip)|| 0;
    console.log("in get-blog");
  try {
    const blogDb = await getAllBlogs({SKIP});
    console.log("in get-blog");
    if(!blogDb){
        return res.send({
            status: 202,
            message: "No more todos",
          });
    }
    return res.send({
      status: 200,
      message: "Read Successfull",
      data: blogDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal Server Error",
      error: error,
    });
  }
});

BlogRouter.get("/my-blog", async(req, res)=>{
    let userId=req.session.user.userId;
    let SKIP=parseInt(req.query.skip)||0;
    try {
        const blogDb=await getMyBlogs({userId, SKIP});
        if (blogDb.length === 0) {
            return res.send({
              status: 202,
              message: "No more todos",
            });
          }
        console.log()
        return res.send({
            status:200,
            message:"blogs fetched successfully",
            data:blogDb
        })
    } catch (error) {
        return res.send({
            status:500,
            message:"Internal Server Error",
            error:error
        })
    }

})

module.exports = BlogRouter;
