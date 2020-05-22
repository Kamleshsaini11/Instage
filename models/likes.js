var mongoose=require("mongoose");

var likeSchema= new mongoose.Schema({
    author: {
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
    },
    camp:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Campground"
        },
    }
});


module.exports= mongoose.model("Like", likeSchema);