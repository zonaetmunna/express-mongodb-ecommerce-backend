// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const { createProduct, getAllProducts, getSingleProduct, updateProduct, deleteProduct } = require('../controller/productController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/', 
// verifyToken, 
createProduct);
router.get('/', getAllProducts);
router.get('/:productId', getSingleProduct);
router.put('/:productId', updateProduct);
router.delete('/:productId', deleteProduct);

module.exports = router;