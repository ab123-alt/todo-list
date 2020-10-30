const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// DB

mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// schema
const itemSchema = new mongoose.Schema({
  name: String,
});

// model -> in the databse todolistDB, a collection with the name items 
// will be created automatically, when a new Item is created for the first time
const Item = mongoose.model("Item", itemSchema);

// document1
const item1 = new Item({ name: "Welcome to your ToDo List:" });

// document2
const item2 = new Item({ name: "Item2" });

// document3
const item3 = new Item({ name: "Item3" });

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemSchema],
};

const List = mongoose.model("List", listSchema);

// http

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
      res.redirect("/");
    } else {
      res.render("list", { listTitle: "Today", newItems: foundItmes });
    }
  });
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/:listname", (req, res) => {
  var customListName = req.params.listname;

  var entry = List.findOne({ name: customListName }, (err, foundList) => {
    if (!err) {
      if (!foundList) {
        const newList = new List({
          name: customListName,
          items: defaultItems,
        });
        newList.save();
        res.redirect('/' + customListName);
      } else {
        res.render("list", {
          listTitle: foundList.name,
          newItems: foundList.items,
        });
      }
    }
  });
});

app.post("/", (req, res) => {
  const itemName = req.body.newItem;
  const listName = req.body.list;
  console.log('listName', listName);

  const item = new Item({
    name: itemName,
  });
  item.save();
  if (listName === "Today") {
    res.redirect("/");
  } else {
    List.findOne({name: listName}, (err, foundList) => {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});

app.post("/delete", (req, res) => {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === 'Today') {
    Item.findByIdAndRemove(checkedItemId, (err) => {
      if (!err) {
        console.log("Successfully deleted checked item.");
        res.redirect("/");
      } else {
        console.log("Something went wrong");
      }
    });
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, (err, foundList) => {
      if (!err) {
        res.redirect("/" + listName);
      }
    })
  }


});

app.listen(3000, () => {
  console.log("server started on port 3000");
});
