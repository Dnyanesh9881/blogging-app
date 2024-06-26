
 const BlogDataValidation=({title, textBody})=>{
   return new Promise  ((resolve, reject)=>{

    if(!title || !textBody) reject("Missing Blog Data");

    if (typeof title !== "string") reject("Blog title is not a text");
    if (typeof textBody !== "string") reject("Blog body is not a text");

    resolve();
   })   
 }

 module.exports=BlogDataValidation;