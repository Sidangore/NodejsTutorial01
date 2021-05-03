const mongoose = require('mongoose');
const Product = require('./product');
const Order = require('./order');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [{
            productID: { type: Schema.Types.ObjectId, required: true, ref: 'Product' },
            quantity: { type: Number, required: true }
        }],
        // subtotal: { type: Number, required: true }
    }
});

userSchema.methods.addToCart = function(product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
        return cp.productID.toString() == product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];
    if (cartProductIndex >= 0) {
        newQuantity = this.cart.items[cartProductIndex].quantity + 1;
        updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
        updatedCartItems.push({ productID: product._id, quantity: newQuantity });
    }
    const updatedCart = {
        items: updatedCartItems
    };
    this.cart = updatedCart;
    return this.save();
}

userSchema.methods.removeCartItem = function(productID) {
    const updatedCartItems = this.cart.items.filter(item => {
        return item.productID.toString() !== productID.toString();
    });
    this.cart.items = updatedCartItems;
    return this.save();
}

userSchema.methods.clearCart = function() {
    this.cart = {
        items: []
    }
    return this.save();
}

module.exports = mongoose.model('User', userSchema);
// const mongodb = require('mongodb');
// class User {
//     constructor(username, email, cart, _id) {
//         this.username = username;
//         this.email = email;
//         this.cart = cart ? cart : cart = { items: [] };
//         this._id = _id;
//     }
//     save() {
//         const db = getDb();
//         db.collection('users').insertOne(this);
//     }

//     static findById(userID) {
//         const db = getDb();
//         return db.collection('users')
//             .findOne({ _id: new mongodb.ObjectID(userID) })
//             .then(user => {
//                 // console.log(user);
//                 return user;
//             }).catch(err => {
//                 console.log(err);
//             });
//     }

//     addToCart(product) {
//         const cartProductIndex = this.cart.items.findIndex(cp => {
//             return cp.productID.toString() == product._id.toString();
//         });
//         let newQuantity = 1;
//         const updatedCartItems = [...this.cart.items];
//         if (cartProductIndex >= 0) {
//             newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//             updatedCartItems[cartProductIndex].quantity = newQuantity;
//         } else {
//             updatedCartItems.push({ productID: new mongodb.ObjectId(product._id), quantity: newQuantity });
//         }
//         const updatedCart = { items: updatedCartItems };

//         const db = getDb();
//         return db.collection('users')
//             .updateOne({
//                 _id: new mongodb.ObjectId(this._id)
//             }, {
//                 $set: {
//                     cart: updatedCart
//                 }
//             });
//     }

//     getCart() {
//         const db = getDb();
//         const productIds = this.cart.items.map(i => {
//             return i.productID;
//         });
//         return db.collection('products').find({
//                 _id: { $in: productIds }
//             })
//             .toArray()
//             .then(products => {
//                 return products.map(p => {
//                     return {...p,
//                         quantity: this.cart.items.find(i => {
//                             return i.productID.toString() === p._id.toString();
//                         }).quantity
//                     }
//                 })
//             })
//             .catch(err => {
//                 console.log(err);
//             });
//     }

//     deleteCartItemById(productID) {
//         const updatedCartItems = this.cart.items.filter(item => {
//             return item.productID.toString() !== productID.toString();
//         });
//         const db = getDb();
//         return db.collection('users').updateOne({
//             _id: new mongodb.ObjectID(this._id)
//         }, {
//             $set: { cart: { items: updatedCartItems } }
//         })
//     }

//     addOrder() {
//         const db = getDb();
//         return this.getCart().then(products => {
//                 const order = {
//                     items: products,
//                     user: {
//                         _id: new mongodb.ObjectID(this._id),
//                         username: this.username,
//                         email: this.email
//                     }
//                 };
//                 return db.collection('orders').insertOne(order);
//             })
//             .then(result => {
//                 this.cart = { items: [] };
//                 return db.collection('users').updateOne({
//                     _id: new mongodb.ObjectID(this._id)
//                 }, {
//                     $set: { cart: { items: [] } }
//                 })
//             });
//     }

//     getOrders() {
//         const db = getDb();
//         return db.collection('orders').find({ 'user._id': new mongodb.ObjectID(this._id) }).toArray().then(
//             orders => {
//                 // console.log('Orders of the user: ', orders);
//                 return orders;
//             }
//         ).catch(err => {
//             console.log(err);
//         });
//     }
// }

// module.exports = User;
// module.exports = User;