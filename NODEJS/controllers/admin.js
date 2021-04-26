const Product = require('../models/product');

// GET the Products
exports.getAddProduct = (req, res, next) => {
    //
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
    Product.create({
            title: title,
            description: description,
            price: price,
            imageURL: imageURL,
            userId: req.user.id
        })
        .then(result => {
            // console.log(result);
            console.log('Created the product!');
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
    Product.findByPk(productID).then(product => {
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
    Product.findByPk(productID).then(product => {
        product.title = updatedTitle;
        product.price = updatedPrice;
        product.description = updatedDescription;
        product.imageURL = updatedImageURL;
        return product.save();
    }).then(result => {
        console.log('Updated Product!');
        res.redirect('/admin/products');
    }).catch(err => {
        console.log(err);
    })
};

// GET products
exports.getProducts = (req, res, next) => {
    Product.findAll().then(products => {
        res.render('admin/products', { pageTitle: "Admin Products", products: products, path: '/admin/products' });
    }).catch(err => {
        console.log(err);
    })
}

// POST DELETE PRODUCT
exports.postDeleteProduct = (req, res, next) => {
    const productID = req.body.productID;
    Product.findByPk(productID).then(
        product => {
            return product.destroy();
        }
    ).then(
        () => {
            console.log('Product Deleted!');
            res.redirect('/admin/products');
        }
    ).catch(err => {
        console.log(err);
    });
}