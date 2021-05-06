const express = require('express');
const router = express.Router();
const path = require('path');
const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

// (GET) Products
router.get('/add-product', isAuth, adminController.getAddProduct);

// (POST) Add Product
router.post("/add-product", isAuth, adminController.postAddProduct);

// (GET) Admin Products
router.get('/products', isAuth, adminController.getProducts);

// (GET) Edit Product
router.get('/edit-product/:productID', isAuth, adminController.getEditProduct);

// (POST) Edit Product
router.post('/edit-product', isAuth, adminController.postEditProduct);

// (POST) Delete Product
router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;