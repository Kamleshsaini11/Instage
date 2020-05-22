var mongoose=require("mongoose");
var passportLocalMongoose= require("passport-local-mongoose");

var userSchema= new mongoose.Schema({
    firstname:String, 
    lastname:String,
    email:String,
    username:String,
    avatar:String,
    password:String
});

userSchema.plugin(passportLocalMongoose);

User= mongoose.model("User", userSchema);
module.exports=User;