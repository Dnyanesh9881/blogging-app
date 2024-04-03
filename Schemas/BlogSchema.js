const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const blogSchema=new Schema({
    title:{
        type:String,
        required:true,
        trim:true,
        minLength:3,
        maxLength:500
    },
    textBody:{
        type:String,
        required:true,
        trim:true,
        minLength:10,
        maxLength:2000
    },
    createDateTime:{
        type:String,
        required:true,
    },
    userId:{
        type:Schema.Types.ObjectId,
        required:true,
       ref:"user"
    },
});

module.exports=mongoose.model("blog",blogSchema);