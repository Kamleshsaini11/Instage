var mongoose =require("mongoose");


var campgroundSchema= new mongoose.Schema({
    name:String,
    image:String,
    imageId:String, 
    description:String,
    author: {
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String
    },
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Comment"
        }
    ],
    likes:{
        type:Number,
        default:0
    }, 
    date:String
});

// var Campground=mongoose.model("Campground", campgroundSchema);

module.exports= mongoose.model("Campground", campgroundSchema);