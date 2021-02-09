const express = require("express");
const router = express.Router();


const { isSignedIn, isAdmin, isAuthenticated } = require("../controllers/auth");
const { getUserById,pushOrderInpurchaseList } = require("../controllers/user");
const {updateStock} = require("../controllers/product");
const {getOrderById, createOrder,getAllOrders,orderStatus,updateOrderStatus} = require("../controllers/order");

//PARAMETER TO GET ORDER ID
router.param("userId",getUserById);
router.param("orderId",getOrderById);
//ROUTES
//POST ROUTE
router.post("/order/create/:userId",
isSignedIn,
isAuthenticated,
pushOrderInpurchaseList,
updateStock,
createOrder);

//READ ROUTE
router.get("/order/all/:userId",isSignedIn,isAuthenticated,isAdmin,getAllOrders);
//READ ROUTE FOR ORDER STATUS
router.get("/order/status/:userId",isSignedIn,isAuthenticated,isAdmin,orderStatus);
//UPDATE ROUTE FOR ORDER STATUS
router.get("/order/:orderId/status/:userId",isSignedIn,isAuthenticated,isAdmin,updateOrderStatus);
module.exports = router;