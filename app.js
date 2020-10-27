const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

var items = ["Buy food", "Cook food", "Eat food"];

app.get("/", (req, res) => {
  const currentDay = new Date();
  options = { weekday: "long", day: "numeric", month: "long" };
  var day = currentDay.toLocaleDateString("de-DE", options);
  res.render("list", { kindOfDay: day, newItems: items });
});

app.post("/", (req, res) => {
  item = req.body.newItem;
  items.push(item);
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("server started on port 3000");
});
