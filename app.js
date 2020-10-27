const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  const currentDay = new Date().getDay();
  var day = "";

  switch (currentDay) {
    case 0:
      day = "Sunday";
      break;
    case 1:
      day = "Monday";
      break;
    case 2:
      day = "Tuesday";
      break;
    case 3:
      day = "Wednesday";
      break;
    case 4:
      day = "Thursday";
      break;
    case 5:
      day = "Friday";
      break;
    case 6:
      day = "Saturday";
      break;

    default:
        console.log('currentDay is equal to', currentDay);
      break;
  }
  res.render("list", { kindOfDay: day });
});

app.listen(3000, () => {
  console.log("server started on port 3000");
});
