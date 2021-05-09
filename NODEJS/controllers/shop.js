const Product = require('../models/product');
// const User = require('../models/user');
const Order = require('../models/order');


//SHOP PRODUCTS GET
exports.getProducts = (req, res, next) => {
    Product
        .find()
        .then(products => {
            res.render('shop/product-list', { pageTitle: "Shop", products: products, path: '/products' });
        })
        .catch(err => { console.log(err); });
};

// HOME PAGE
exports.getIndex = (req, res, next) => {
    Product
        .find()
        .then(products => {
            res.render('shop/product-list', { pageTitle: "My Home Page", products: products, path: '/' });
        })
        .catch(err => { console.log(err); });
};

// (GET) Product Detail for single product
exports.getProduct = (req, res, next) => {
    const productID = req.params.productID;
    Product
        .findById(productID)
        .then(product => {
            res.render('shop/product-detail', { pageTitle: product.title, product: product, path: '/products' });
        })
        .catch(err => {
            console.log(err);
        });
};

// (GET) Cart
exports.getCart = (req, res, next) => {
    req.user
        .populate('cart.items.productID')
        .execPopulate()
        .then(user => {
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: user.cart.items
            })
        })
        .catch(err => {
            console.log(err);
        });
}

// (POST) Cart
exports.postCart = (req, res, next) => {
    const productID = req.body.productID;
    Product
        .findById(productID)
        .then(product => {
            return req.user.addToCart(product)
                .then(() => {
                    console.log('Product Added to Cart!');
                    res.redirect('/cart');
                })
                .catch(err => {
                    console.log(err);
                });
        })
        .catch(err => {
            console.log(err);
        });
}

// (POST) Delete Cart Item
exports.postDeleteCartProduct = (req, res, next) => {
    const productID = req.body.productID;
    req.user
        .removeCartItem(productID)
        .then(() => {
            console.log('Product Deleted from Cart!');
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err);
        });
}


// (GET) Orders
exports.getOrders = (req, res, next) => {
    Order
        .find({ 'user.userID': req.user._id })
        .then(orders => {
            res.render('shop/orders', { pageTitle: "Your Orders", path: '/orders', orders: orders });
        })
        .catch(err => console.log(err));
}


// (POST) Order
exports.postOrders = (req, res, next) => {
    req.user
        .populate('cart.items.productID')
        .execPopulate()
        .then(user => {
            const products = user.cart.items.map(i => {
                return { quantity: i.quantity, product: {...i.productID._doc } } //IMPORTANT NOTE FOR SELF
            });
            let total = user.cart.items.map(i => {
                return i.quantity * i.productID.price;
            });
            const order = new Order({
                user: {
                    username: req.user.username,
                    userID: req.user._id
                },
                products: products,
                orderTotal: total.reduce((a, b) => { return a + b })
            });
            return order.save();
        })
        .then(() => {
            return req.user.clearCart();
        })
        .then(() => {
            console.log('Order Created');
            res.redirect('/orders');
        })
        .catch(err => {
            console.log(err);
        });
}