const express = require("express");
const router = express.Router();

const { validationResult, check } = require('express-validator');

const {signup,signout,signin,isSignedIn} = require("../controllers/auth");


router.post ("/signup",[
    check("name","atleast 3 char").isLength({min:3}),
    check("email","enter a valid email address").isEmail(),
    check("password","password must be atleast 8 char").isLength({min:8})
],signup);


router.post ("/signin",[
    check("email","enter a valid email address").isEmail(),
    check("password","password is required").isLength({min:1})
],signin);



router.get("/signout",signout);


router.post ("/testing",isSignedIn, (req,res) => {
    res.json(req.auth)
})
module.exports = router;