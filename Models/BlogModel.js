const BlogSchema = require("../Schemas/BlogSchema");
const { LIMIT } = require("../constants");

const createBLog = ({ title, textBody, createDateTime, userId }) => {
  return new Promise(async (resolve, reject) => {
    const blogObj = new BlogSchema({
      title,
      textBody,
      createDateTime,
      userId,
    });
    try {
      const blogDb = await blogObj.save();
      resolve(blogDb);
    } catch (error) {
      reject(error);
    }
  });
};
const getAllBlogs = ({ SKIP }) => {
  return new Promise(async (resolve, reject) => {
    console.log(SKIP);
    try {
      const blogDb = await BlogSchema.aggregate([
        { $sort: { createDateTime: -1 } },
        {
          $facet: {
            data: [{ $skip: SKIP }, { $limit: LIMIT }],
          },
        },
      ]);
      console.log(blogDb);
      resolve(blogDb);
    } catch (error) {
      reject(error);
    }
  });
};
const getMyBlogs = ({ userId, SKIP }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const blogDb = await BlogSchema.aggregate([
        { $match: { userId: userId } },
        { $sort: { createDateTime: -1 } },
        {
          $facet: {
            data: [{ $skip: SKIP }, { $limit: LIMIT }],
          },
        },
      ]);
      console.log(blogDb);
      resolve(blogDb);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { createBLog, getAllBlogs, getMyBlogs };
