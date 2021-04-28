const express = require('express');
const router = express.Router();
const path = require('path');
const adminController = require('../controllers/admin');
// const rootDirectory = require('../utility/path');

// /admin/add-product => GET
router.get('/add-product', adminController.getAddProduct);

// /admin/add-product => POST
router.post("/add-product", adminController.postAddProduct);

// GET /admin/products
router.get('/products', adminController.getProducts);

// GET /admin/edit/:productID
router.get('/edit-product/:productID', adminController.getEditProduct);

// POST /admin/edit-product
router.post('/edit-product', adminController.postEditProduct);

// POST for DELETE
router.post('/delete-product', adminController.postDeleteProduct);

module.exports = router;