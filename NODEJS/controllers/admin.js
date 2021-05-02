const mongodb = require('mongodb');
const Product = require('../models/product');
// GET the Products
exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', { pageTitle: "Add Product", path: '/admin/add-product', editing: false });
};

//POST the Product
exports.postAddProduct = (req, res, next) => {
    console.log(req.user);
    //making the Object Product
    const title = req.body.title;
    const imageURL = req.body.imageURL;
    const description = req.body.description;
    const price = req.body.price;
    const product = new Product(title, price, imageURL, description, null, req.user._id);
    product.save()
        .then(result => {
            // console.log(result);
            console.log('Product Created!');
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        });
};

// GET Edit Product
exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const productID = req.params.productID;

    Product.findById(productID)
        .then(product => {
            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', { pageTitle: "Edit Product", path: '/admin/edit-product', editing: editMode, product: product });
        })
}

// POST edit product
exports.postEditProduct = (req, res, next) => {
    const productID = req.body.productID;
    const updatedTitle = req.body.title;
    const updatedImageURL = req.body.imageURL;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;
    const product = new Product(updatedTitle, updatedPrice, updatedImageURL, updatedDescription, new mongodb.ObjectID(productID));
    product.save()
        .then(result => {
            console.log('Product Updated!');
            res.redirect('/admin/products');
        }).catch(err => {
            console.log(err);
        })
};

// GET products
exports.getProducts = (req, res, next) => {
    Product.fetchAll().then(products => {
        res.render('admin/products', { pageTitle: "Admin Products", products: products, path: '/admin/products' });
    }).catch(err => {
        console.log(err);
    });
}

// POST DELETE PRODUCT
exports.postDeleteProduct = (req, res, next) => {
    const productID = req.body.productID;
    Product.deleteById(productID)
        .then(
            () => {
                console.log('Product Deleted!')
                res.redirect('/admin/products');
            }
        )
        .catch(err => {
            console.log(err);
        });
}