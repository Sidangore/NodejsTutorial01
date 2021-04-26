//Class import
const Product = require('../models/product');
const Cart = require('../models/cart');


//SHOP Routes GET
exports.getProducts = (req, res, next) => {
    //fetch All Products
    Product.fetchAll().then(([rows, data]) => {
        // console.log(rows, data);
        res.render('shop/product-list', { pageTitle: "Shop", products: rows, path: '/products' });
    }).catch(err => {
        console.log(err);
    });
};

// GET the product details
exports.getProduct = (req, res, next) => {
    const productID = req.params.productID;
    Product.findById(productID).then(([product]) => {
        // console.log(product, '\n');
        res.render('shop/product-detail', { pageTitle: product[0].title, product: product[0], path: '/products' });
    }).catch(err => console.log(err));
};

// HOME PAGE
exports.getIndex = (req, res, next) => {
    Product.fetchAll().then(([rows, data]) => {
        // console.log(rows, data);
        res.render('shop/product-list', { pageTitle: "My Home Page", products: rows, path: '/' });
    }).catch(err => {
        console.log(err);
    });
};

//GET /cart
exports.getCart = (req, res, next) => {
    Cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];
            for (product of products) {
                const cartProductData = cart.products.find(p => p.id === product.id);
                if (cart.products.find(p => p.id === product.id)) {
                    cartProducts.push({
                        productData: product,
                        qty: cartProductData.qty
                    });
                }
            }
            res.render('shop/cart', { pageTitle: "My Cart", path: '/cart', products: cartProducts });

        })
    });
}

//POST /cart
exports.postCart = (req, res, next) => {
    const productID = req.body.productID;
    Product.findById(productID, (product) => {
        Cart.addProduct(productID, product.price);
    });
    res.redirect('/cart');
}

// POST /cart-delete-product
exports.postDeleteCartProduct = (req, res, next) => {
    const productID = req.body.productID;
    Product.findById(productID, product => {
        Cart.deleteProduct(productID, product.price);
        res.redirect('/cart');
    });
}


// GET /orders (shows the previous orders)
exports.getOrders = (req, res, next) => {
    res.render('shop/orders', { pageTitle: "My Orders", path: '/orders' });
}

//GET /checkout
exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', { pageTitle: "Checkout", path: '/checkout' });
}