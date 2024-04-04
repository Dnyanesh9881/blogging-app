const express = require("express");
require("dotenv").config();
const db = require("./db");
const AuthRouter = require("./Controllers/AuthController");
const session = require("express-session");
const BlogRouter = require("./Controllers/BlogController");
const isAuth = require("./Middlewares/AuthMiddleware");
const FollowRouter = require("./Controllers/FollowController");
const mongoDbsession = require("connect-mongodb-session")(session);

const app = express();
const store = new mongoDbsession({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

app.use(express.json());
app.use(
    session({
      secret: process.env.SECRET_KEY,
      resave: false,
      saveUninitialized: false,
      store: store,
    })
  );
app.use("/auth", AuthRouter);
app.use("/blog",isAuth, BlogRouter);
app.use("/follow", isAuth, FollowRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on ${process.env.PORT}`);
});
