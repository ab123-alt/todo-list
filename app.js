const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});

// schema
const itemSchema = new mongoose.Schema({
  name: String
})

// model -> in the databse todolistDB, a collection with the name items will be created 
const Item = mongoose.model('Item', itemSchema);

// document1
const item1 = new Item({name: 'Welcome to your ToDo List'});

// document2
const item2 = new Item({name: 'Welcome to your ToDo List2'});

// document3
const item3 = new Item({name: 'Welcome to your ToDo List3'});

const defaultItems = [item1, item2, item3];

Item.insertMany(defaultItems, (err) => {
  if(err) {
    console.log('Something went wrong', err);
  } else {
    console.log('Successfully created default items');
  }
})

app.get("/", (req, res) => {
  const currentDay = new Date();
  options = { weekday: "long", day: "numeric", month: "long" };
  var day = currentDay.toLocaleDateString("de-DE", options);
  res.render("list", { listTitle: day, newItems: items });
});

app.get("/work", (req, res) => {
  res.render("list", { listTitle: "Work list", newItems: workItems });
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.post("/", (req, res) => {
  console.log(req.body);
  item = req.body.newItem;
  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

app.listen(3000, () => {
  console.log("server started on port 3000");
});
