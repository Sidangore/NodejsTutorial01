//Class import
const Product = require('../models/product');

//SHOP Routes GET
exports.getProducts = (req, res, next) => {
    //fetch All Products
    Product.fetchAll().then(products => {
        res.render('shop/product-list', { pageTitle: "Shop", products: products, path: '/products' });
    }).catch(err => {
        console.log(err);
    });
};

// GET the product details
exports.getProduct = (req, res, next) => {
    const productID = req.params.productID;
    Product.findById(productID).then(product => {
        res.render('shop/product-detail', { pageTitle: product.title, product: product, path: '/products' });
    }).catch(err => {
        console.log(err);
    });
};

// // HOME PAGE
exports.getIndex = (req, res, next) => {
    Product.fetchAll().then(products => {
        res.render('shop/product-list', { pageTitle: "My Home Page", products: products, path: '/' });
    }).catch(err => {
        console.log(err);
    });
};

//GET /cart
exports.getCart = (req, res, next) => {
    req.user.getCart()
        .then(products => {
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: products
            })
        })
        .catch(err => {
            console.log(err);
        });
}

//POST /cart
exports.postCart = (req, res, next) => {
    const productID = req.body.productID;
    Product.findById(productID).then(product => {
        return req.user.addToCart(product)
            .then(result => {
                console.log('Product Added to Cart!');
                res.redirect('/cart');
            })
            .catch(err => {
                console.log(err);
            });
    });
}

// POST /cart-delete-product
exports.postDeleteCartProduct = (req, res, next) => {
    const productID = req.body.productID;
    req.user.deleteCartItemById(productID).then(result => {
        console.log('Product Deleted from Cart!');
        res.redirect('/cart');
    }).catch(err => {
        console.log(err);
    })
}


// GET /orders (shows the previous orders)
exports.getOrders = (req, res, next) => {
    req.user.getOrders().then(orders => {
        res.render('shop/orders', { pageTitle: "Your Orders", path: '/orders', orders: orders });
    }).catch(err => console.log(err));
}

exports.postOrders = (req, res, next) => {
    req.user.addOrder()
        .then(result => {
            console.log('Order Created!');
            res.redirect('/orders');
        })
        .catch(err => {
            console.log(err);
        })
}