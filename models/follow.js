var mongoose=require("mongoose");
var passportLocalMongoose= require("passport-local-mongoose");

var followSchema= new mongoose.Schema({
    firstfollow:String, 
    accepter : String
});

userSchema.plugin(passportLocalMongoose);

User= mongoose.model("Follow", followSchema);
module.exports=Follow;