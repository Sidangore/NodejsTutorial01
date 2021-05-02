const mongodb = require('mongodb');
const getDb = require('../utility/database').getDb;

class Product {
    constructor(title, price, imageURL, description, _id, userID) {
        this.title = title;
        this.price = price;
        this.imageURL = imageURL;
        this.description = description;
        this._id = _id ? new mongodb.ObjectID(_id) : null;
        this.userID = userID;
    }

    save() {
        const db = getDb();
        if (this._id) {
            //update the product
            return db.collection('products')
                .updateOne({ _id: this._id }, { $set: this })
                .then()
                .catch(err => {
                    console.log(err);
                });
        } else {
            return db.collection('products')
                .insertOne(this)
                .then(result => {
                    console.log(result);
                })
                .catch(err => console.log(err));
        }
    }

    static fetchAll() {
        const db = getDb();
        return db.collection('products').find({})
            .toArray()
            .then(products => {
                return products;
            }).catch(err => {
                console.log(err);
            });
    }

    static findById(productID) {
        const db = getDb();
        return db.collection('products')
            .find({
                _id: new mongodb.ObjectId(productID)
            })
            .next()
            .then(product => {
                // console.log(product);
                return product;
            }).catch(err => {
                console.log(err);
            });
    }

    static deleteById(productID) {
        const db = getDb();
        return db.collection('products')
            .deleteOne({ _id: new mongodb.ObjectID(productID) }).then().catch(err => {
                console.log(err);
            })

    }
}

module.exports = Product;