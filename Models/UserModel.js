const UserSchema = require("../Schemas/UserSchema");
const bcrypt = require("bcryptjs");

class User {
  name;
  username;
  email;
  password;
  constructor({ name, username, email, password }) {
    this.name = name;
    this.username = username;
    this.email = email;
    this.password = password;
  }

  registerUser() {
    return new Promise(async (resolve, reject) => {
      const hashPassword = await bcrypt.hash(
        this.password,
        parseInt(process.env.SALT)
      );

      const userObj = new UserSchema({
        name: this.name,
        username: this.username,
        email: this.email,
        password: hashPassword,
      });
      try {
        const userDb = await userObj.save();
        resolve(userDb);
      } catch (error) {
        reject(error);
      }
    });
  }

  static isEmailUsernsameExist({ username, email }) {
    return new Promise(async (resolve, reject) => {
      try {
        const userExist = await UserSchema.findOne({
          $or: [{ email }, { username }],
        });
        console.log(userExist);
        if (userExist && userExist.email === email) {
          reject("Email already exist");
        }
        if (userExist && userExist.username === username) {
          reject("Username already exist");
        }
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  static findUserWithLoginId({ loginId }) {
    return new Promise(async (resolve, reject) => {
      try {
        const userDb=await UserSchema.findOne({
          $or:[{email:loginId}, {username:loginId}]
        }).select("+password");
        if(!userDb) reject("User not found register first");
        resolve(userDb);
      } catch (error) {
        reject(error)
      }
    });
  }
}

module.exports = User;
