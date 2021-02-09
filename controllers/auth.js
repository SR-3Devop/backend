const User = require ("../models/user");
const {validationResult, check } = require('express-validator');
var jwt = require ("jsonwebtoken");
var expressJwt = require ("express-jwt");


exports.signup = (req,res,) => {

const errors = validationResult(req);
if(!errors.isEmpty()){
    return res.status(422).json({
        error: errors.array()[0].param
    });
}

   const user = new User (req.body);
   user.save((err, user) => {
       if (err){
           return res.status(400).json({
               err: "Not Able to receive user data"
           });
       }
       res.json({
           name: user.name,
           email: user.email,
           id: user._id
       });
   });
};

exports.signin = (req,res) => {
 const errors = validationResult(req);
  const {email,password} = req.body;
  if(!errors.isEmpty()){
    return res.status(422).json({
        error: errors.array()[0].msg
    });
}
User.findOne({email},(err,user) => {
    if(err || !user){
       return res.status(400).json({
            error: "Email is Not found"
        });
    }
    if(!user.autheticate(password)){
        return res.status(401).json({
            error: "email and password not match"
        });
    }
    const token = jwt.sign({_id:user._id},process.env.CODE)


res.cookie("token", token,{expire: new Date() +9999});

const {_id,email,name,role} = user;
return res.json({token,user:{_id,email,name,role}
});
})


}




exports.signout = (req,res,) => {
    res.clearCookie("token");
    res.json({
        message:"user singedout successfully"
  
    });
};
exports.isSignedIn = expressJwt({
    secret: process.env.CODE,
    userProperty: "auth"
})
//Custom Middleware 
exports.isAuthenticated = (req,res,next) => {
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;
    if(!checker){
       return res.status(403).json({
            message: "Access Denied"
        })
    }
    next();
}
exports.isAdmin = (req,res,next) => {
    if(req.profile.role === 0){
        return res.status(403).json ({
            message: "Admin access denied"
        })
    }
    next();
}
