const express = require('express');
const router = express.Router();

// Import the logic we wrote in the Controller
const { 
    addOrderItems, 
    getMyOrders, 
    getOrders 
} = require('../controllers/orderController');

// Import the security guards
const { protect, admin } = require('../middleware/authMiddleware');

// Route 1: The main '/api/orders' URL
// - POST: Used by Customers to place an order (Protected by login)
// - GET:  Used by Admins to see ALL orders (Protected by login + admin check)
router.route('/')
    .post(protect, addOrderItems)
    .get(protect, admin, getOrders);

// Route 2: The '/api/orders/myorders' URL
// - GET: Used by Customers to see ONLY their own history
router.route('/myorders').get(protect, getMyOrders);

module.exports = router;