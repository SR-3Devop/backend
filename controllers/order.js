const{Order, ProductCart} = require("../models/order");

exports.getOrderById = (req,res,next,id) => {
    ProductCart.findById(id)
    .populate("products.product", "name price")
    .exec((err,order) => {
        if(err){
            return res.status(400).json({
                error: "Unable to find Order in DB"
            });
        }
        req.order = order;
        next();
    });
};

exports.createOrder = (req,res) =>{
    req.body.order.user = req.profile;
    const order = new Order(req.body.order);
    order.save((err,order) => {
        if(err){
            return res.status(400).json({
                error:"Unable to create order in DB"
            });

        };
        res.json(order);
    });
};

exports.getAllOrders = (req,res) => {
    Order.find().populate("user", "_id name")
    .exec((err,order) => {
        if(err){
            return res.status(400).json({
                error: "Unable to get All the Orders from DB"
            });
        }
        res.json(order);
    });
};

exports.orderStatus = (req,res) => {
    res.json(Order.schema.path("status").enumValues);
};

exports.updateOrderStatus = (req,res) => {
 Order.update(
     {_id: req.body.orderId },
     {$set: {status: req.body.status}},
     (err,order) => {
         if(err){
             return res.status(400).json({
                 error: "Unable to Update order Status in DB"
             });

         };
         res.json(order);
     }
 );
};
