const mongodb = require('mongodb');
const Product = require('../models/product');
// (GET) the Products
exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', { pageTitle: "Add Product", path: '/admin/add-product', editing: false });
};

// (POST) the Product
exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageURL = req.body.imageURL;
    const description = req.body.description;
    const price = req.body.price;
    const product = new Product({ title: title, price: price, imageURL: imageURL, description: description, userID: req.user._id });
    product
        .save()
        .then(() => {
            console.log('Product Created!');
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        });
};

// (GET) Products
exports.getProducts = (req, res, next) => {
    Product
        .find()
        // .select('title price imageURL -_id')
        // .populate('userID', 'username')
        .then(products => {
            res.render('admin/products', { pageTitle: "Admin Products", products: products, path: '/admin/products' });
        }).catch(err => {
            console.log(err);
        });
}

// (GET) Edit Product
exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const productID = req.params.productID;
    Product
        .findById(productID)
        .then(product => {
            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', { pageTitle: "Edit Product", path: '/admin/edit-product', editing: editMode, product: product });
        })
        .catch(err => {
            console.log(err);
        });
}

// (POST) edit product
exports.postEditProduct = (req, res, next) => {
    const productID = req.body.productID;
    const updatedTitle = req.body.title;
    const updatedImageURL = req.body.imageURL;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;
    Product
        .findByIdAndUpdate(productID, { title: updatedTitle, price: updatedPrice, description: updatedDescription, imageURL: updatedImageURL })
        .then(() => {
            console.log('Product Updated!');
            res.redirect('/admin/products')
        })
        .catch(err => {
            console.log(err);
        });
};

// (POST) Delete Product
exports.postDeleteProduct = (req, res, next) => {
    const productID = req.body.productID;
    Product.findByIdAndDelete(productID)
        .then(() => {
            console.log('Product Deleted!')
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        });
}