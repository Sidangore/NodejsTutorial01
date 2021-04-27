//Class import
const Product = require('../models/product');

//SHOP Routes GET
exports.getProducts = (req, res, next) => {
    //fetch All Products
    Product.findAll().then(products => {
        res.render('shop/product-list', { pageTitle: "Shop", products: products, path: '/products' });

    }).catch(err => {
        console.log(err);
    });
};

// GET the product details
exports.getProduct = (req, res, next) => {
    const productID = req.params.productID;
    Product.findByPk(productID).then(product => {
        res.render('shop/product-detail', { pageTitle: product.title, product: product, path: '/products' });
    }).catch(err => {
        console.log(err);
    });
};

// HOME PAGE
exports.getIndex = (req, res, next) => {
    Product.findAll().then(products => {
        res.render('shop/product-list', { pageTitle: "My Home Page", products: products, path: '/' });
    }).catch(err => {
        console.log(err);
    });
};

//GET /cart
exports.getCart = (req, res, next) => {
    req.user.getCart()
        .then(cart => {
            // console.log(cart);
            return cart.getProducts().then(products => {
                    res.render('shop/cart', {
                        pageTitle: "My Cart",
                        path: '/cart',
                        products: products
                    });
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
}

//POST /cart
exports.postCart = (req, res, next) => {
    const productID = req.body.productID;
    let fetchedCart;
    let newQuantity = 1;

    req.user
        .getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts({ where: { id: productID } });
        })
        .then(products => {
            let product;
            if (products.length > 0) {
                product = products[0];
            }
            if (product) {
                // change the qty
                const oldQty = product.cartItem.quantity;
                newQuantity = oldQty + 1;
                return product;
            }
            return Product.findByPk(productID);
        }).then(product => {
            return fetchedCart.addProduct(product, { through: { quantity: newQuantity } })
        }).then(() => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));

}

// POST /cart-delete-product
exports.postDeleteCartProduct = (req, res, next) => {
    const productID = req.body.productID;
    req.user.getCart().then(cart => {
        return cart.getProducts({ where: { id: productID } });
    }).then(
        products => {
            const product = products[0];
            return product.cartItem.destroy();
        }
    ).then(result => {
        res.redirect('/cart');
    }).catch(err => console.log(err));
}


// GET /orders (shows the previous orders)
exports.getOrders = (req, res, next) => {
    req.user.getOrders({ include: ['products'] }).then(orders => {
        console.log(orders);
        res.render('shop/orders', { pageTitle: "My Orders", path: '/orders', orders: orders });
    }).catch(err => console.log(err));
}

//GET /checkout
exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', { pageTitle: "Checkout", path: '/checkout' });
}

exports.postOrders = (req, res, next) => {
    let fetchedCart;
    req.user.getCart().then(cart => {
        fetchedCart = cart;
        return cart.getProducts();
    }).then(products => {
        return req.user.createOrder().then(
            order => {
                return order.addProducts(products.map(product => {
                    product.orderItem = {
                        quantity: product.cartItem.quantity
                    };
                    return product;

                }));
            }).catch(err => console.log(err));
    }).then(
        result => {
            return fetchedCart.setProducts(null);
        }
    ).then(() => { res.redirect('/orders'); }).catch(err => console.log(err));
}