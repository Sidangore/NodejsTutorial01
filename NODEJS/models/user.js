const mongodb = require('mongodb');
const getDb = require('../utility/database').getDb;
class User {
    constructor(username, email, cart, _id) {
        this.username = username;
        this.email = email;
        this.cart = cart ? cart : cart = { items: [] };
        this._id = _id;
    }
    save() {
        const db = getDb();
        db.collection('users').insertOne(this);
    }

    static findById(userID) {
        const db = getDb();
        return db.collection('users')
            .findOne({ _id: new mongodb.ObjectID(userID) })
            .then(user => {
                // console.log(user);
                return user;
            }).catch(err => {
                console.log(err);
            });
    }

    addToCart(product) {
        const cartProductIndex = this.cart.items.findIndex(cp => {
            return cp.productID.toString() == product._id.toString();
        });
        let newQuantity = 1;
        const updatedCartItems = [...this.cart.items];
        if (cartProductIndex >= 0) {
            newQuantity = this.cart.items[cartProductIndex].quantity + 1;
            updatedCartItems[cartProductIndex].quantity = newQuantity;
        } else {
            updatedCartItems.push({ productID: new mongodb.ObjectId(product._id), quantity: newQuantity });
        }
        const updatedCart = { items: updatedCartItems };

        const db = getDb();
        return db.collection('users')
            .updateOne({
                _id: new mongodb.ObjectId(this._id)
            }, {
                $set: {
                    cart: updatedCart
                }
            });
    }
}


module.exports = User;