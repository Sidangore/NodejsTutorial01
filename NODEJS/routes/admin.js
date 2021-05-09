const express = require('express');
const router = express.Router();
const path = require('path');
const adminController = require('../controllers/admin');
// const rootDirectory = require('../utility/path');

// (GET Products
router.get('/add-product', adminController.getAddProduct);

// (POST) Add Product
router.post("/add-product", adminController.postAddProduct);

// (GET) Admin Products
router.get('/products', adminController.getProducts);

// (GET) Edit Product
router.get('/edit-product/:productID', adminController.getEditProduct);

// (POST) Edit Product
router.post('/edit-product', adminController.postEditProduct);

// (POST) Delete Product
router.post('/delete-product', adminController.postDeleteProduct);

module.exports = router;