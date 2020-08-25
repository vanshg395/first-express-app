const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const adminRoutes = require("./routes/admin.js");
const shopRoutes = require("./routes/shop.js");

const app = express();

app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use((req, res, next) => {
  res.status(404).sendfile(path.join(__dirname, "views", "error.html"));
});

app.listen(3000, () => {
  console.log("Listening to Port: 3000");
});
