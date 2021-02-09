const express = require("express");
const router = express.Router();

const { isSignedIn, isAuthenticated } = require("../controllers/auth");

const {  processPayment } = require("../controllers/payment");

router.post(
  "/payment",
  processPayment
);

module.exports = router;