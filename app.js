const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

var items = ["Buy food", "Cook food", "Eat food"];
var workItems = [];

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
