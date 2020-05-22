//===========MODULES REQUIRED============================================
var express= require("express");
var router= express.Router({mergeParams:true});
var passport  = require("passport");
var User= require("../models/user");
var Campground= require("../models/campground");


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
     var newUser= new User(
        {
        username: req.body.username ,
        firstname:req.body.first,
        lastname:req.body.last,
        email:req.body.email,
        avatar:req.body.avatar    
        });
     User.register(newUser, req.body.password, function(err, user){
         if(err){
             req.flash("error", err.message);
             return res.redirect("/register");
         }
           passport.authenticate("local")(req, res,function(){
            req.flash("success", "Welcome "+ user.username + " to YelpCamp"); 
            res.redirect("/campgrounds");
         })
     });
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