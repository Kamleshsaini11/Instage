//===========MODULES REQUIRED============================================
var express= require("express");
var router= express.Router({mergeParams:true});
var Campground= require("../models/campground");
var Comment = require("../models/comment");

//================FINDING A CAMPGROUND AND ITS SPECIFIC COMMENTS================
router.get("/campgrounds/:id/comments/new",isLoggedIn , function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }
        else {
            res.render("comments/new", {campground:campground});
        }
    })
});

//==============POSTING A NEW COMMENT (MIDDLEWARE CONDTION)=======================
router.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
    // lookup campground using ID
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds")
        }
        else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went Wrong");
                    console.log(err);
                }
                else {
                    // add username and id to the comment
                    comment.author.id=req.user._id;
                    comment.author.username= req.user.username;
                    comment.date= new Date();
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success" , "Successfully commented");
                    res.redirect("/campgrounds/"+campground._id);
                }
            });
        }
    });
    // create a new comment
    // connect new comment to campground
    // redirect campground show page 

});

//===================EDIT COMMENT============================================
router.get("/campgrounds/:id/comments/:comment_id/edit", checkowner, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundcomment){
        if(err){
            res.redirect("back");
        }
        else {
            res.render("comments/edit", {comment:foundcomment , campid:req.params.id});
        }
    })
});

//=======================COMMENT UPDATE ======================================
router.put("/campgrounds/:id/comments/:comment_id", checkowner, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id , req.body.comment, function(err, updatedcomment){
        if(err){
            res.redirect("back");
        }   
        else {
            res.redirect("/campgrounds/"+req.params.id);
        }
     })
});

// ===================DESTROY COMMENT ROUTE========================================
router.delete("/campgrounds/:id/comments/:comment_id",checkowner, function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        }
        else {
            req.flash("success", "Successfully Deleted ");
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});


//=============MIDDLEWARE FUNCTION DESCRIBED==========================================
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be Logged In!!!");
    res.redirect("/login");
}

//=================MIDDLEWARE FUNCTION DESCRIBED===========================
function checkowner(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundcomment){
            if(err){
                req.flash("error", "Something went Wrong");
                res.redirect("back");
            }
            else {
                if(foundcomment.author.id.equals(req.user._id)){
                    next();
                }
                else{
                    req.flash("error", "You have no permission to do that");
                    res.redirect("back");
                }
    
            }
        });
    }
    else {
        req.flash("error", "You need to be Logged In!!!");
        res.redirect("back");
    }
}

//====================CALLING FUNCTIONALITY====================================================================
module.exports= router;