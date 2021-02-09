// const Product = require ("../models/product");
// const formidable = require ("formidable");
// const _ = require("lodash");
// const fs = require("fs");



// exports.getProductById = (req,res,next,id) => {
//     Product.findById(id)
//     .populate("category")
//     .exec((err,product) => {
//         if(err){
//             return res.status(400).json({
//                 error: "Unable to find product ID in DB"
//             })
//         }
//         req.product = product
//         next(); 
//     })
// }

// exports.createProduct = (req,res) => {
//     let form = new formidable.IncomingForm();
//     form.keepExtensions = true;

//     form.parse(req,(err, fields, file) => {
//         if(err){
//             return res.status(400).json({
//                 error: "Problem with photo"
//             });
//         };
        
//         const { name, description, category, price, stock} = fields
//         if(!name || !description || !category || !price || !stock){
//             return res.status(400).json({
//                 error: "Please enter all the fields"
//             });
//         };


//         //TODO: fields
//         let field = new Product(fields)


//         // handling the file system
//         if(file.photo){
//             if(file.photo.size > 3000000){
//                 return res.status(400).json({
//                     error: "file is to big to save"
//                 });
//             };
//             product.photo.data = fs.readFileSync(file.photo.path);
//             product.photo.contentType = file.photo.type;

//         };
//         //save to database
//         product.save((err,product) => {
//             if(err){
//                 returnres.status(400).json({
//                     error: "failed to save product in DB "
//                 });
//             }
//             res.json(product);
//         });
//     });
// };
////////////////////////////////////////////////////////////////////////////////////////////////
const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const product = require("../models/product");
const { parseInt, sortBy } = require("lodash");

exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Product not found"
        });
      }
      req.product = product;
      next();
    });
};

exports.createProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "problem with image"
      });
    }
    //destructure the fields
    const { name, description, price, category, stock } = fields;

    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({
        error: "Please include all fields"
      });
    }

    let product = new Product(fields);

    //handle file here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size too big!"
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }
    // console.log(product);

    //save to the DB
    product.save((err, product) => {
      if (err) {
        res.status(400).json({
          error: "Saving  in DB failed"
        });
      }
      res.json(product);
    });
  });
};


exports.getProduct = (req, res) => {
    req.product.photo = undefined;
    return res.json(req.product);
};

exports.photo = (req, res, next) => {
    if(req.product.photo.data){
        res.set("Content-Type", req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
};


exports.deleteProduct = (req,res) => {
  let product = req.product;
  product.remove((err,deletedProduct) => {
    if(err){
      return res.status(400).json({
        error: "Unable delete the product"
      });
    }
    res.json({
      message: "product deleted successfully",
      deletedProduct
    });

  });
};

exports.updateProduct = (req,res) => {

  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "problem with image"
      });
    }
    

    let product = req.product;
    product = _.extend(product,fields)

    //handle file here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size too big!"
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    };
    // console.log(product);

    //save to the DB
    product.save((err, product) => {
      if (err) {
        res.status(400).json({
          error: "updating  in DB failed"
        });
      }
      res.json(product);
    });
  });

};

//LISTING--ALL--PRODUCTS

exports.allProducts = (req,res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8;
  let sort = req.query.sortBy ? req.query.sortBy : "_id"


  Product.find()
  .select("-photo")
  .populate("category")
  .sort([[sortBy, "asc"]])
  .limit(limit)
  .exec((err,products) => {
    if(err){
      return res.status(400).json({
        error: "unable to list all the products"
      });
    };
    res.json(products)
  });
};





exports.getAllUniqueCategory = (req,res) => {
  Product.distinct("category",{}, (err,category) => {
    if(err){
      return res.status(400).json({
        error: "Unable to find Category"
      });
    };
    res.json(category)
  });
};




// MIDDLEWARE FOR UPDATING INVENTORY OPERATIONSS

exports.updateStock = (req,res,next) => {
  let myOperations = req.body.order.products.map( prod => {
    return {
      updateOne:{
        filter:{_id: prod._id},
        update: {$inc:{stock:-prod.count ,sold: +prod.count}}
      }
    }
  })
  Product.bulkWrite(myOperations,{},(err,products) => {
    if(err){
      return res.status(400).json({
        error: "Bulk operations failed"
      });
    };
    next();
  });
};
