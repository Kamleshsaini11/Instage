require('dotenv').config()

var express                =   require("express"),
    app                    =   express(),
    bodyparser             =   require("body-parser"),
    mongoose               =   require("mongoose"),
    Campground             =   require("./models/campground"),
    Comment                =   require("./models/comment"),
    seedDB                 =   require("./seed"),
    passport               =   require("passport"),
    LocalStrategy          =   require("passport-local"),
    passportLocalMongoose  =   require("passport-local-mongoose"),
    User                   =   require("./models/user"),
    methodOverride         =   require("method-override"),
    flash                  =   require("connect-flash"),
    Like                   =   require("./models/likes");
//---------------------Routes Requirement------------------------------------------------------------------------- 
var commentRoutes       =  require("./routes/comments"),
    campgroundRoutes    =  require("./routes/campgrounds"),
    indexRoutes         =  require("./routes/index");

//------------------------Mongoose DB Setup-----------------------------------------------------------------------

// Cluster0
//  mongoose.connect("mongodb+srv://abhinav24:golugupta19@cluster0.5ahtn.mongodb.net/Cluster0?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true}).then(() => console.log( 'Database Connected' )).catch(err => console.log( err ));
mongoose.connect("mongodb://localhost/yelp", {useNewUrlParser: true, useUnifiedTopology: true});

app.use(bodyparser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

// ==========PASSPORT CONFIGURATION =================================
app.use(require("express-session")({
    secret : "abhinav-visual",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//--------------TO PASS INFOMATION OF LOGINED USER ----------------------------------------------------------------- 
app.use(function(req, res, next){
    res.locals.currentUser=req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});
//-------------------------USING OF ROUTES--------------------------------------------------------------------- 
app.use(indexRoutes);
app.use(commentRoutes);
app.use(campgroundRoutes);
//-------------------------LISTEN PORT NUMBER--------------------------------------------------------------------- 
// app.listen(process.env.PORT , process.env.IP);

app.listen(3000, function(){
    console.log("Server start --");
});
