//jshint esversion:6

const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const _ = require("lodash");

let recentRecipes = [];
let allRecipes = {};

//Setting up the required files
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


// DB connection
mongoose.connect("mongodb://localhost:27017/recipeDB");

const recipeSchema = {
    name: String,
    content: String,
    view: Number
};

const Recipe = mongoose.model("Recipe", recipeSchema);

// Routing pages

app.get("/", function (req, res) {

    Recipe.find()
        .sort({ view: -1 }) // Sort in descending order based on 'view' field
        .limit(3) // Retrieve only the top 3 documents
        .exec().then(
            (popularRecipes) => {
                res.render("home", { popularRecipes: popularRecipes });
            }
          ).catch(
            (err) => {
              console.log(err);
            }
          );
});

app.post("/", function (req, res) {

    const recipe = new Recipe({
        name: _.capitalize(req.body.recipeName),
        content: req.body.recipeInstructions,
        view: 0
    });

    recipe.save();
    res.redirect("/");
});

app.get("/recipe", function (req, res) {
    Recipe.find().exec().then(
        (allRecipes) => {
          res.render("recipe", { allRecipes: allRecipes});
        }
      ).catch(
        (err) => {
          console.log(err);
        }
      )    
});

app.get("/recipe/:recipeName/:recipeId", function (req, res) {
    Recipe.findById(req.params.recipeId).exec().then((recipe) => {
        recipeName = recipe.name;
        recipeContent = recipe.content;
        recipeView = recipe.view + 1;
        Recipe.findByIdAndUpdate(req.params.recipeId, {view: recipeView}).exec();
        res.render("oneRecipe",{recipe: recipeName,recipeDescription: recipeContent});
    }).catch((err) => {
        console.log(err)
    }); 
});

app.get("/addrecipe", function (req, res) {
    res.render("addrecipe", {});
});

app.get("/contact", function (req, res) {
    res.render("contact", {});
});

app.get("/about", function (req, res) {
    res.render("about", {});
});


app.listen("3000", function () {
    console.log("Port Successfully established on 3000");
});