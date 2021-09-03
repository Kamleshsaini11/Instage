var mongoose=require("mongoose");
var Campground=require("./models/campground");
var Comment=require("./models/comment");

var data= [
    {
        name:"Brown Brick House",
        image:"https://images.unsplash.com/photo-1587497785982-860d5dd39171?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description:"Image Belong to the section COVID-19 " 
    },
    {
        name:"Person Holding iPhone",
        image:"https://images.unsplash.com/photo-1586497619663-eb8d1d5d5e5e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description:"Image Belong to the section COVID-19 " 
    },
    {
        name:"Blue bus on ROad",
        image:"https://images.unsplash.com/photo-1587466887440-816277c6f79c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description:"Image Belong to the section COVID-19 " 
    },
    {
        name:"Work From Home",
        image:"https://images.unsplash.com/photo-1587235964726-7ede02d4e2d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description:"Image Belong to the section COVID-19 " 
    }

]

function seedDB(){
    Campground.remove({},function(err){
        if(err){
            console.log(err);
        }
            
            });
    }


module.exports= seedDB;