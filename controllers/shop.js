const Product = require("../models/product");
const Cart = require("../models/cart");
const { deleteById } = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
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
  Product.findByPk(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  Cart.findAll()
    .then((cartItems) => {
      let totalPrice = 0;
      for (prod of cartItems) {
        totalPrice += prod.productPrice * prod.qty;
      }
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        prods: cartItems,
        amount: totalPrice,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByPk(prodId)
    .then((prod) => {
      Cart.findByPk(prodId)
        .then((cartItem) => {
          const isOld = cartItem === null ? false : true;
          if (isOld) {
            cartItem.qty = cartItem.qty + 1;
            cartItem
              .save()
              .then((result) => {
                res.redirect("/cart");
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            Cart.create({
              productId: prodId,
              productTitle: prod.title,
              productDescription: prod.description,
              productPrice: prod.price,
              qty: 1,
            })
              .then((result) => {
                res.redirect("/cart");
              })
              .catch((err) => {
                console.log(err);
              });
          }
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
  Cart.findByPk(prodId)
    .then((product) => {
      product
        .destroy()
        .then((result) => {
          res.redirect("/cart");
        })
        .catch((err) => {
          console.log(err);
        });
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
