const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// schema
const itemSchema = new mongoose.Schema({
  name: String
});

// model -> in the databse todolistDB, a collection with the name items will be created
const Item = mongoose.model("Item", itemSchema);

// document1
const item1 = new Item({ name: "Welcome to your ToDo List: item1" });

// document2
const item2 = new Item({ name: "Welcome to your ToDo List2: item2" });

// document3
const item3 = new Item({ name: "Welcome to your ToDo List3: item3" });

const defaultItems = [item1, item2, item3];

app.get("/", (req, res) => {
  const currentDay = new Date();
  options = { weekday: "long", day: "numeric", month: "long" };
  var day = currentDay.toLocaleDateString("de-DE", options);

  Item.find({}, (err, foundItmes) => {
    if (foundItmes.length === 0) {
      Item.insertMany(defaultItems, (err) => {
        if (err) {
          console.log("Something went wrong", err);
        } else {
          console.log("Successfully created default items");
        }
      });
      res.redirect('/');
    }  else {
      res.render("list", { listTitle: day, newItems: foundItmes });
    }  

  });
});

app.get("/work", (req, res) => {
  res.render("list", { listTitle: "Work list", newItems: workItems });
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.post("/", (req, res) => {
  const itemName = req.body.newItem;
  const item = new Item({
    name: itemName
  })
  item.save();
  if (req.body.list === "Work") {
    res.redirect("/work");
  } else {
    res.redirect("/");
  }
});

app.post('/delete', (req, res) => {
  console.log(req.body.checkbox);
  const checkedItemId = req.body.checkbox;
  Item.findByIdAndRemove(checkedItemId, (err) => {
    if(!err) {
      console.log("Successfully deleted checked item.")
      res.redirect('/');
    } else {
      console.log("Something went wrong");
    }
  })
});

app.listen(3000, () => {
  console.log("server started on port 3000");
});
