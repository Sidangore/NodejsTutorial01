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

// (GET) Single product Detail page
router.get('/products/:productID', shopController.getProduct);

// (GET) Cart
router.get('/cart', shopController.getCart);

// (POST) Cart
router.post('/cart', shopController.postCart);

// (POST) Remove Item from Cart
router.post('/cart-delete-product', shopController.postDeleteCartProduct);

//(GET) Orders
router.get('/orders', shopController.getOrders);

// (POST) Orders
router.post('/create-order', shopController.postOrders);

//Exports
module.exports = router;