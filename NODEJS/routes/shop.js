// Note:- always put the specific route above than a dynamic routes
const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/is-auth');

//Controllers
const shopController = require('../controllers/shop');

// Starting page
router.get('/', shopController.getIndex);

// (GET) Products
router.get('/products', shopController.getProducts);

// (GET) Single product Detail page
router.get('/products/:productID', shopController.getProduct);

// (GET) Cart
router.get('/cart', isAuth, shopController.getCart);

// (POST) Cart
router.post('/cart', isAuth, shopController.postCart);

// (POST) Remove Item from Cart
router.post('/cart-delete-product', isAuth, shopController.postDeleteCartProduct);

//(GET) Orders
router.get('/orders', isAuth, shopController.getOrders);

// (POST) Orders
router.post('/create-order', isAuth, shopController.postOrders);

//Exports
module.exports = router;