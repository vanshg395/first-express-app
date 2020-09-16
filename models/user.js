const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

class User {
  constructor(username, email, cart, id) {
    this.username = username;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }

  save() {
    const db = getDb();
    return db.collection("users").insertOne(this);
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex((cp) => {
      return cp.productId.toString() === product._id.toString();
    });
    let newQty = 1;
    const updatedCartItems = [...this.cart.items];
    if (cartProductIndex >= 0) {
      newQty = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQty;
    } else {
      updatedCartItems.push({
        productId: new mongodb.ObjectId(product._id),
        quantity: newQty,
      });
    }
    const updatedCart = {
      items: updatedCartItems,
    };
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

  getCart() {
    const db = getDb();
    const productIds = this.cart.items.map((i) => i.productId);
    return db
      .collection("products")
      .find({ _id: { $in: productIds } })
      .toArray()
      .then((products) => {
        if (this.cart.items.length !== products.length) {
          // this.cart.items.map(i => {})
          const updatedCartItems = this.cart.items.filter((item) => {
            return productIds.includes(item.productId.toString());
          });
          return db
            .collection("users")
            .updateOne(
              { _id: new mongodb.ObjectId(this._id) },
              { $set: { cart: { items: updatedCartItems } } }
            );
        }
        return products.map((p) => {
          return {
            ...p,
            quantity: this.cart.items.find((i) => {
              return i.productId.toString() === p._id.toString();
            }).quantity,
          };
        });
      });
  }

  deleteItemFromCart(prodId) {
    const db = getDb();
    const updatedCartItems = this.cart.items.filter((item) => {
      return item.productId.toString() !== prodId;
    });
    console.log(updatedCartItems);
    return db
      .collection("users")
      .updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        { $set: { cart: { items: updatedCartItems } } }
      );
  }

  addOrder() {
    const db = getDb();
    return this.getCart()
      .then((products) => {
        const order = {
          items: products.map((p) => {
            return {
              _id: p._id,
              title: p.title,
              desciption: p.description,
              imageUrl: p.imageUrl,
              price: p.price,
              quantity: p.quantity,
            };
          }),
          user: {
            _id: this._id,
            username: this.username,
            email: this.email,
          },
        };
        return db.collection("orders").insertOne(order);
      })
      .then(() => {
        this.cart.items = [];
        return db
          .collection("users")
          .updateOne(
            { _id: new mongodb.ObjectId(this._id) },
            { $set: { cart: { items: [] } } }
          );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getOrders() {
    const db = getDb();
    return db.collection("orders").find({ "user._id": this._id }).toArray();
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({ _id: new mongodb.ObjectId(userId) });
  }
}

module.exports = User;
