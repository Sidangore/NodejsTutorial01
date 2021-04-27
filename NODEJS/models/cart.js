// //imports
// const fs = require('fs');
// const path = require('path');

// //MODELS
// const Product = require('./product');

// // Make the path
// const p = path.join(path.dirname(require.main.filename), 'data', 'cart.json');

// //helpers

// module.exports = class Cart {
//     // Add Product
//     static addProduct(productID, productPrice) {
//             // Fetch the previous cart
//             fs.readFile(p, (err, fileData) => {
//                 let cart = { products: [], totalPrice: 0 }
//                 if (!err) {
//                     cart = JSON.parse(fileData);
//                 }
//                 //analyse the cart => if we have 
//                 const existingProductIndex = cart.products.findIndex(product => product.id === productID);
//                 const existingProduct = cart.products[existingProductIndex];
//                 // Increase the QTY
//                 let updatedProduct;
//                 if (existingProduct) {
//                     updatedProduct = {...existingProduct };
//                     updatedProduct.qty = updatedProduct.qty + 1;

//                     cart.products = [...cart.products];
//                     cart.products[existingProductIndex] = updatedProduct
//                         // NEW product
//                 } else {
//                     updatedProduct = { id: productID, qty: 1 };
//                     cart.products = [...cart.products, updatedProduct];

//                 }
//                 // Update the cart price
//                 cart.totalPrice = Number(cart.totalPrice) + Number(productPrice);
//                 // save the file
//                 fs.writeFile(p, JSON.stringify(cart), err => {
//                     console.log(err);
//                 });
//             });
//         }
//         //UPDATE CART
//     static updateCartTotal(id, oldPrice, newPrice) {
//             //fetch from the cart
//             fs.readFile(p, (err, fileData) => {
//                 if (err) {
//                     return;
//                 }
//                 let cart = JSON.parse(fileData);
//                 const product = cart.products.find(p => p.id === id);
//                 if (product == null) {
//                     return console.log('Product not in cart!');
//                 }
//                 const qty = product.qty;
//                 cart.totalPrice = cart.totalPrice + (newPrice * qty) - (oldPrice * qty);
//                 console.log(cart);

//                 //save to file
//                 fs.writeFile(p, JSON.stringify(cart), err => {
//                     if (err) {
//                         console.log(err);
//                     }
//                 });
//             });
//         }
//         //DELETE Product
//     static deleteProduct(id, productPrice) {
//         fs.readFile(p, (err, fileData) => {
//             if (err) {
//                 return;
//             }
//             //update the cart
//             const updatedCart = {...JSON.parse(fileData) };

//             const product = updatedCart.products.find(p => p.id === id);
//             if (product == null) {
//                 return console.log('Product Not in cart!');
//             }

//             const productQty = product.qty;
//             updatedCart.products = updatedCart.products.filter(p => p.id !== id);
//             updatedCart.totalPrice = updatedCart.totalPrice - productPrice * productQty;

//             //save to the file
//             fs.writeFile(p, JSON.stringify(updatedCart), err => {
//                 if (err) {
//                     console.log(err);
//                 }
//             });
//         });
//     }

//     //Fetch cart products
//     static getCart(callback) {
//         fs.readFile(p, (err, fileData) => {
//             const cart = JSON.parse(fileData);
//             if (err) {
//                 callback(null);
//             } else {
//                 callback(cart);
//             }

//         });
//     }
// }

const Sequelize = require('sequelize');
const sequelize = require('../utility/database');

const Cart = sequelize.define('cart', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }
});

module.exports = Cart;