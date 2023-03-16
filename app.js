const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
var _ = require('lodash');

const app = express();

app.set('view engine', 'ejs');

mongoose.set('strictQuery', true);
mongoose.connect("mongodb://localhost:27017/blogDB");

const blogschema = mongoose.Schema({
  title: String,
  content: String
})

let blogDB = mongoose.model("topic", blogschema)

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";



let topicParams = "";


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get('/', function (req, res) {
  blogDB.find({}, function (err, data) {
    if (err) {
      console.log(err);
    }
    else {
      res.render("home", { homeData: homeStartingContent, blogdata: data })
    }
  })

})

app.get('/about', function (req, res) {
  res.render("about", { aboutData: aboutContent });
})

app.get('/contact', function (req, res) {
  res.render("contact", { contactData: contactContent })
})

app.get('/compose', function (req, res) {
  res.render("compose");
})

app.post('/composedata', function (req, res) {

  let topic = new blogDB({
    title: req.body.title,
    content: req.body.titledisc
  })
  topic.save().then(function () {
    res.redirect("/");
  })
})

app.get('/post/:topic', function (req, res) {
  blogDB.find({}, function (err, results) {
    results.forEach(function (data) {
      topicParams = _.lowerCase(req.params.topic)
      if (_.lowerCase(data.title) === topicParams) {
        res.render("post", { searchTitle: data.title, searchContent: data.content });
        console.log("match found");
      } else {
        console.log("match not found");
      }
    })

  })
})

app.post("/delete", function (req, res) {

  let contentid = req.body.id;
  blogDB.deleteOne({ id: contentid }, function (err) {
    if (!err) {
      console.log("deleted")
      res.redirect('/')
    }
  })
});



app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});
