const path = require("path");

const express = require("express");

const router = express.Router();

router.get("/addProduct", (req, res, next) => {
  res.sendfile(path.join(__dirname, "..", "views", "addProduct.html"));
});

router.post("/addProduct", (req, res, next) => {
  console.log(req.body["title"]);
  res.redirect("/");
});

module.exports = router;
