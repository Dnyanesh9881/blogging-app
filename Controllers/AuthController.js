const express = require("express");
const { validateRegisterUserData } = require("../Utils/AuthUtil");
const User = require("../Models/UserModel");
const bcrypt=require("bcryptjs");
const AuthRouter = express.Router();

AuthRouter.post("/register", async (req, res) => {
  const { name, username, email, password } = req.body;
  
  //Data Validation
  try {
    await validateRegisterUserData({ name, username, email, password });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Data Error",
      error: error,
    });
  }
  try {
    await User.isEmailUsernsameExist({ username, email });
  } catch (error) {
    return res.send({
      status: 400,
      message: error,
    });
  }

  try {
    const userObj = new User({ name, username, email, password });
    const userDb = await userObj.registerUser();
    console.log(userDb);
    return res.send({
      status: 201,
      message: "Registration successfull",
      data: userDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal Server Error",
      error: error,
    });
  }
});

AuthRouter.post("/login", async (req, res) => {
  const { loginId, password } = req.body;
  if (!loginId || !password) {
    return res.send({
      status: 400,
      message: "All fields are mandatory",
    });
  }
  try {
    const userDb = await User.findUserWithLoginId({ loginId });
     console.log(userDb);
     const userExist=await bcrypt.compare(password, userDb.password);
     if(!userExist){
      return res.send({
         status:400,
         message:"Password does not matched"
      })
     }
     console.log(req.session);
     req.session.isAuth=true,
     req.session.user={
      userId:userDb._id,
      email:userDb.email,
      username:userDb.username
     }
     console.log(req.session);
   return res.send({
      status:200,
      message:"Login Successfully"
   })
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal Server Error",
      error: error,
    });
  }
});

module.exports = AuthRouter;
