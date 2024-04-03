const BlogSchema = require("../Schemas/BlogSchema");

const createBLog=({title, textBody, createDateTime, userId})=>{
    return new Promise (async(resolve, reject)=>{
        const blogObj=new BlogSchema({
            title,
            textBody,
            createDateTime,
            userId
        });
        try {
            const blogDb= await blogObj.save();
            resolve(blogDb);
        } catch (error) {
            reject(error);
        }
    })
}

module.exports=createBLog;