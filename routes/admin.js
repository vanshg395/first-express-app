const express = require("express");

const router = express.Router();

router.get("/addProduct", (req, res, next) => {
  res.send(
    "<form action='/admin/product' method='POST'><input type='text' name='title'><button type='submit'>Add</button></form>"
  );
});

router.post("/product", (req, res, next) => {
  console.log(req.body["title"]);
  res.redirect("/");
});

module.exports = router;
