const db = require("../util/database");
const Cart = require("./cart");

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    return db.execute(
      "INSERT INTO products (title, description, imageUrl, price) VALUES (?, ?, ?, ?)",
      [this.title, this.description, this.imageUrl, this.price]
    );
  }

  static fetchAll() {
    return db.execute("SELECT * FROM products");
  }

  updateById(id) {
    return db.execute(
      "UPDATE products SET title = ?, description = ?, price = ?, imageUrl = ? WHERE id = ?",
      [this.title, this.description, this.price, this.imageUrl, id]
    );
  }

  static findById(id) {
    return db.execute("SELECT * FROM products WHERE id = ?", [id]);
  }

  static deleteById(id) {
    return db.execute("DELETE FROM products WHERE id=  ?", [id]);
  }
};
