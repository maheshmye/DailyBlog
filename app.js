//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose=require("mongoose")

mongoose.connect("mongodb://localhost:27017/blogDB",{useNewUrlParser:true,useUnifiedTopology: true})

const homeStartingContent = "this is a blog website. here you can share you blogs,daily routine,fun facts etc.,";
const aboutContent = "this blog website belongs to mahesh";
const contactContent = "contact us at instagram whatsapp.facebook not using";

const app = express();

const blogschema= new mongoose.Schema({
  blogtitle:String,
  blogcontent:String
})

const blogmodel=mongoose.model("blog",blogschema)



app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/", function(req, res){
blogmodel.find({},function(err,foundlist){
  if(!err)
  {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: foundlist
      });
  }
})
  
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){

const blogdata=new blogmodel({
  blogtitle:req.body.postTitle,
  blogcontent:req.body.postBody
})

blogdata.save(function(err)
{
   if(!err)
   res.redirect("/");
})

  

});

app.get("/posts/:postName", function(req, res){
  const requestedTitle = _.lowerCase(req.params.postName);
blogmodel.find({},function(err,foundlist){
  foundlist.forEach(function(post){
    const storedTitle = _.lowerCase(post.blogtitle);

    if (storedTitle === requestedTitle) {
      console.log("hey")
      res.render("post", {
        title: post.blogtitle,
        content: post.blogcontent
      });
    }
  });
})
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
