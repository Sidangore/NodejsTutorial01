// //imports
// const db = require('../utility/database');
// //MODELS
// const Cart = require('./cart');


// //PRODUCT
// module.exports = class Product {
//     constructor(id, title, imageURL, description, price) {
//         this.id = id;
//         this.title = title;
//         this.imageURL = imageURL;
//         this.description = description;
//         this.price = Number(price);
//     }

//     save() {
//         return db.execute('insert into products (title, price, description, imageURL) values (?, ?, ?, ?)', [
//             this.title, this.price, this.description, this.imageURL
//         ]);
//     }

//     //DELETE Product 
//     static deleteById(id) {

//     }

//     // Fetch all the products
//     static fetchAll() {
//         return db.execute('select * from products'); //This returns a promise so we return it

//     }

//     //Load the product detail
//     static findById(id) {
//         return db.execute('select * from products where products.id = ?', [id]);
//     }
// }

const { Model } = require('sequelize');
const Sequelize = require('sequelize');
const sequelize = require('../utility/database');

const Product = sequelize.define('product', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    price: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    imageURL: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Product;