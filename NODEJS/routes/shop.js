// Note:- always put the specific route above than a dynamic routes
const express = require('express');
const router = express.Router();
const path = require('path');

//Controllers
const shopController = require('../controllers/shop');

//starting page
router.get('/', shopController.getIndex);

//GET /products
router.get('/products', shopController.getProducts);

// GET the specific product Details /products/{id}
router.get('/products/:productID', shopController.getProduct);

// GET /cart
router.get('/cart', shopController.getCart);

// POST /cart
router.post('/cart', shopController.postCart);

// POST delete product from the cart
router.post('/cart-delete-product', shopController.postDeleteCartProduct);

//GET /orders
router.get('/orders', shopController.getOrders);

// POST Orders
router.post('/create-order', shopController.postOrders);

// GET /checkout
router.get('/checkout', shopController.getCheckout);

//Exports
module.exports = router;