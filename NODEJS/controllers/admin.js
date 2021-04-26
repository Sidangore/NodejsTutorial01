const Product = require('../models/product');

// GET the Products
exports.getAddProduct = (req, res, next) => {
    //
    res.render('admin/edit-product', { pageTitle: "Add Product", path: '/admin/add-product', editing: false });
};

//POST the Product
exports.postAddProduct = (req, res, next) => {

    //making the Object Product
    const title = req.body.title;
    const imageURL = req.body.imageURL;
    const description = req.body.description;
    const price = req.body.price;
    const product = new Product(null, title, imageURL, description, price);

    //Saving
    product
        .save()
        .then(() => {
            res.redirect('/');
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
    Product.findById(productID, product => {
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

    const updatedProduct = new Product(productID, updatedTitle, updatedImageURL, updatedDescription, updatedPrice);
    console.log(updatedProduct);
    updatedProduct.save();
    return res.redirect('/admin/products');
};

// GET products
exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('admin/products', { pageTitle: "Admin Products", products: products, path: '/admin/products' });
    });
}

// POST DELETE PRODUCT
exports.postDeleteProduct = (req, res, next) => {
    const productID = req.body.productID;

    Product.deleteById(productID);
    res.redirect('/admin/products');
}