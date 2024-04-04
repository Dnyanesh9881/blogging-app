const BlogSchema = require("../Schemas/BlogSchema");
const { LIMIT } = require("../constants");
const { ObjectId } = require("mongodb");

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

const getBlogWithId = ({ blogId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!ObjectId.isValid(blogId)) reject("Invalid bloId format");

      const blogDb = await BlogSchema.findOne({ _id: blogId });

      if (!blogDb) reject(`No Blog found with blogId : ${blogId}`);
      resolve(blogDb);
    } catch (error) {
      reject(error);
    }
  });
};

const updateBlog=({title, textBody, blogId})=>{
    return new Promise(async(resolve, reject)=>{

        try {
            const blogDb=await BlogSchema.findByIdAndUpdate({_id:blogId}, {title, textBody});
            resolve(blogDb);
        } catch (error) {
            reject(error);
        }
    })
};

const deleteBlog=({blogId})=>{
    return new Promise(async(resolve, reject)=>{
      
        try {
            const blogDb=await BlogSchema.findOneAndDelete({_id:blogId});
            resolve(blogDb);
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = { createBLog, getAllBlogs, getMyBlogs, getBlogWithId, updateBlog, deleteBlog };
