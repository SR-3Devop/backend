const User = require ("../models/user")
const Order = require("../models/order")


exports.getUserById = (req,res,next,id) => {
    User.findById(id).exec((err,user) => {
        if(err || !user){
            return res.status(400).json({
                message: "User not found in DB"
            })
        }
        req.profile = user;
        next();
    })
  
}

exports.getUser = (req,res) => {

    // req.profile.salt = undefined;
    // req.profile.encry_password = undefined;
    req.profile.createdAt = undefined;
    req.profile.updatedAt = undefined;
    
    return res.json(req.profile)
}

exports.updateUser = (req,res) => {
    User.findByIdAndUpdate(
        {_id: req.profile._id},
        {$set: req.body},
        {new:true,useFindAndModify:false},
        (err,user) => {
            if(err){
                return res.status(400).json({
                    error : "Your are not allowed to update the profile"
                })
            }
         user.salt = undefined
            res.json(user)
        }
    )
}


exports.userPurchaseList = (req,res) => {
    Order.find({user:req.profile._id})
    .populate("user", "_id name")
    .exec((err,user) => {
        if (err){
            return res.status(400).json({
                error: "orders not found in this profile"
            })
        }
        return res.json(order)
    })
}


exports.pushOrderInpurchaseList = (req,res,next) => {
    
    let purchases = []
    req.body.order.products.forEach(product => {
        purchases.push({
            _id : product._id,
            name: product.name,
            description: product.description,
            category: product.category,
            quantity: product.quantity,
            amount: req.body.order.amount,
            transaction_id : req.body.transaction_id
        })
    });

// Database connection
 User.findOneAndUpdate(
     {_id:req.profile._id},
     {$push:{purchases:purchases}},
     {new: true},
     (err,purchases) => {
        if(err){
            return res.status(400).json({
                error : "Unable to update the user information"
            })
        }
        next()
     }
 )




}