const db = require("../util/database");

module.exports = class Cart {
  static addProduct(id, title, description, productPrice, isOld) {
    if (isOld) {
      return db.execute("UPDATE cart SET qty = qty + 1 WHERE productId = ?", [
        id,
      ]);
    } else {
      return db.execute(
        "INSERT INTO cart (productId, productTitle, productDescription, price, qty) VALUES (?, ?, ?, ?, ?)",
        [id, title, description, productPrice, 1]
      );
    }
  }

  static findById(id) {
    return db.execute("SELECT * FROM cart WHERE productId = ?", [id]);
  }

  static fetchAll() {
    return db.execute("SELECT * FROM cart");
  }

  static deleteProduct(id) {
    return db.execute("DELETE FROM cart where productId = ?", [id]);
  }
};
