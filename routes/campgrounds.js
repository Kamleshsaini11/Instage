//===========MODULES REQUIRED============================================
var express= require("express");
var router= express.Router({mergeParams:true});
var Campground= require("../models/campground");
var Like= require("../models/likes");
var multer= require("multer");
var storage= multer.diskStorage({
    filename:function(req, file, callback){
        callback(null, Date.now() + file.originalname);
    }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|mp4)$/i)) {
        return cb(new Error('Only image and video files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'instage', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});
//=================MAIN PAGE==============================================
router.get("/campgrounds", function(req, res){
    // GET ALL CAMPGROUND FROM 
    Campground.find({}, function(err, allcampground){
        if(err){
            console.log(err);
        }
        else {
            res.render("campgrounds/index",{campgrounds:allcampground , currentUser : req.user});
        }
    });

});

// ====================CREATE CAMPGROUND AND ADD TO DB============================================== 
router.post("/campgrounds", isLoggedIn, upload.single('image'), function(req, res) {

    cloudinary.v2.uploader.upload(req.file.path, function(err,result) {
        if(err){
            req.flash("error", err.message);
            return res.redirect("back");
        }        // add cloudinary url for the image to the campground object under image property
        
        req.body.campground.image = result.secure_url;
        // add image's public_id to campground object
        req.body.campground.imageId = result.public_id;
        req.body.campground.date= new Date();
        // add author to campground
        req.body.campground.author = {
          id: req.user._id,
          username: req.user.username
        }
        Campground.create(req.body.campground, function(err, campground) {
          if (err) {
            req.flash('error', err.message);
            return res.redirect('back');
          }
          res.redirect('/campgrounds/' + campground.id);
        });
      });
    });


// ========================NEW ROUTE FORM===================================================================== 
router.get("/campgrounds/new",isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});



//=====================SHOW MORE INFO ABOUT A CAMPGROUND=======================================================
router.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundcamp){
        if(err){
            console.log(err)
        }
        else {
            console.log(foundcamp)
            res.render("campgrounds/show",{campground:foundcamp});
        }
    });
});

//===================EDIT CAMPGROUND ROUTE===========================================
router.get("/campgrounds/:id/edit", check, function(req,res){
            Campground.findById(req.params.id, function(err, foundcamp){
                    res.render("campgrounds/edit" , {campground:foundcamp});
            });
});

//===================UPDATE CAMPGROUND ROUTE===========================================
router.put("/campgrounds/:id",check, function (req, res) {
    //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id , req.body.campground, function(err,updated){
        if(err){
            res.redirect("/campgrounds");
        }
        else {
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
    // redirect somewhere(show page)

  });

// ===================DESTROY CAMPGROUND ROUTE========================================
router.delete("/campgrounds/:id", check,function(req,res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        }
        else {
            res.redirect("/campgrounds");
        }
        
    })
});

router.get("/campgrounds/:id/like" , isLoggedIn, function(req, res){
        var author={
            id:req.user._id
        };
        var camp={
            id:req.params.id
        };
        var newlike= {author:author, camp:camp};
        Like.create(newlike, function(err,newlylike){
            if(err){
                console.log(err);
            }
            else {
                    Campground.findById(req.params.id  , function(err, foundcamp){
                        if(err){
                            console.log(err);
                        }
                        else {
                            foundcamp.likes= foundcamp.likes + 1 ;
                            foundcamp.save();
                            res.render("../views/campgrounds/show",  {campground: foundcamp});
                            }
                           
                        
                });
            }
        });
});

//=============MIDDLEWARE FUNCTION DESCRIBED==========================================
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be Logged In!!!");
    res.redirect("/login");
}

//=============MIDDLEWARE FUNCTION DESCRIBED==========================================
function check(req,res,next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundcamp){
            if(err){
                req.flash("error" , "Post not found");
                res.redirect("back");
            }
            else {
                if(foundcamp.author.id.equals(req.user._id)){
                    next();
                }
                else{
                req.flash("error" , "Permission Denied");
                    res.redirect("back");
                }
            }
        });
    }
    else {
        req.flash("error", "You need to be Logged in First ");
        res.redirect("back");
    }
}


//===============MIDDLEWARE IS USER LOGGED IN AND Not YET LIKED THAT PHOTO ===================================
// function isLoggedInAndLiked(req, res, next){
//     if(req.isAuthenticated()){
//         Like.findBy(req.user._id && req.params.id , function(err, foundliked){
//             if(err){
//                 console.log(err);
//             }
//             else {
//                 console.log("Like Founded");
//                 return next();
//             }
//         });
        
//     }
//     req.flash("error", "You need to be Logged In!!!");
//     res.redirect("/login");
// }
//====================CALLING FUNCTIONALITY====================================================================
module.exports= router;