//===========MODULES REQUIRED============================================
var express= require("express");
var router= express.Router({mergeParams:true});
var passport  = require("passport");
var User= require("../models/user");
var Campground= require("../models/campground");
var Comment= require("../models/comment");


//  =================FRONT PAGE===========================================
router.get("/", function(req ,res){
    res.render("landing");
 });

 // ===========Register REQUEST FORM======================================= 
 router.get("/register", function(req, res){
     res.render("register");
 });

 //============= REGISTER POSTING ==========================================
 router.post("/register", function(req, res){
  console.log(req.body);
  console.log(req.body.etherCnt)
     // var newUser= new User(
     //    {
     //    username: req.body.ether ,
     //    });
     // console.log(newUser.username);
 });
 
 // =============LOGIN FORM===================================================
 router.get("/login", function(req, res){
     res.render("login");
 });
 
//================LOGIN DATABSE CHECKUP POSTING ================================
 router.post("/login", passport.authenticate("local", {

     successRedirect: "/campgrounds",
     failureRedirect:"/login"
 }), function(req, res){
     
 });
 
 //================LOGOUT=========================================================
 router.get("/logout", function(req, res){
     req.logout();
     req.flash("success", "Successfully Logged Out!!!")
     res.redirect("/campgrounds");
 });

 //=================ABOUT PAGE===================================================
 router.get("/about" , function(req, res){
     res.render("about");
 });
 //================MOST LIKED ================================================
 router.get("/mostliked" , function(req, res){
    var query=[{$match:{}},
        {$sort:{likes:-1}},
        {$limit:1}
    ];
    Campground.aggregate(query,function(err,camp){
          if (err)
            console.log(err);
          else{ 
             
            //   res.render("mostliked"  , { id:id  ,  nolikes:nolikes})
            console.log("id of campground that has most likes "+camp[0]._id);
            console.log("number of likes "+camp[0].likes);
            Campground.findById(camp[0]._id).populate("comments").exec(function(err, foundcamp){
                if(err){
                    console.log(err)
                }
                else {
                    console.log(foundcamp)
                    res.render("campgrounds/show",{campground:foundcamp});
                }
            });
            
          }
    });
 });

 //====================MOST COMMENTED POST ======================================
 router.get("/mostcomment" , function(req, res){
    Campground.aggregate([
        // Project with an array length
        { "$project": {
            "name":1,
            "image":1,
            "imageId":1,
            "description":1,
            "author":1,
            "comments":1,
            "likes":1,
            "date":1,
            "length": { "$size": "$comments" }
        }},
        // Sort on the "length"
        { "$sort": { "length": -1 } },
        {"$limit":1}
        ],function(err,camp){
            if (err)
                console.log(err);
            else{
                console.log("id of campground that has most comments "+camp[0]._id);
                console.log("number of comments "+camp[0].length);

            Campground.findById(camp[0]._id).populate("comments").exec(function(err, foundcamp){
                if(err){
                    console.log(err)
                }
                else {
                    console.log(foundcamp)
                    res.render("campgrounds/show",{campground:foundcamp});
                }
            });
          }
    });
 });
   

 //==================USER PROFILE PAGE===========================================
 router.get("/user/:id" , function(req, res){
    User.findById(req.params.id , function(err, founduser){
        if(err){
            req.flash("error" , "User profile Not Found");
            res.redirect("/campgrounds");
        }
        Campground.find().where("author.id").equals(founduser._id).exec(function(err, campgrounds){
            if(err){
                req.flash("error" , "User profile Not Found");
                res.redirect("/campgrounds");
            }
            res.render("userprofile" , {currentuser : founduser , campgrounds: campgrounds});
        });
        
        
    })
 })
 
 //===============MIDDLEWARE FUNCTION=============================================
 function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("success" , "Please Login First !")
    res.redirect("/login");
};

// ======================SENDING FUNCTIONALITY======================================
 module.exports= router;