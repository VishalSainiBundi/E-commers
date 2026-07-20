const express = require('express');
const {
    createOrder,
    getOrderById,
    updateOrder,
    deleteOrder,
    getAllOrders,
    getUserOrder,
    verifyPayment
} = require('../controllers/OrderController');

const OrderRouter = express.Router();

// ✅ SPECIFIC ROUTES FIRST
OrderRouter.get('/user/:userId', getUserOrder);
OrderRouter.post('/verify-payment', verifyPayment);

// ✅ GENERAL ROUTES AFTER
OrderRouter.post('/', createOrder);
OrderRouter.get('/', getAllOrders);
OrderRouter.get('/:id', getOrderById);
OrderRouter.put('/:id', updateOrder);
OrderRouter.delete('/:id', deleteOrder);

module.exports = OrderRouter;