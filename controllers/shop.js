const Product = require("../models/product");
const Cart = require("../models/cart");
const { deleteById } = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, fieldsData]) => {
      res.render("shop/product-list", {
        prods: rows,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(([product]) => {
      res.render("shop/product-detail", {
        product: product[0],
        pageTitle: product[0].title,
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, fieldsData]) => {
      res.render("shop/index", {
        prods: rows,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  Cart.fetchAll()
    .then(([rows]) => {
      let totalPrice = 0;
      for (prod of rows) {
        totalPrice += prod.price * prod.qty;
      }
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        prods: rows,
        amount: totalPrice,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(([prod]) => {
      Cart.findById(prodId)
        .then(([rows]) => {
          console.log(rows);
          const isOld = rows.length == 0 ? false : true;
          Cart.addProduct(
            prodId,
            prod[0].title,
            prod[0].description,
            prod[0].price,
            isOld
          )
            .then(() => {
              res.redirect("/");
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDeleteCart = (req, res, next) => {
  const prodId = req.body.productId;
  Cart.deleteProduct(prodId)
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
