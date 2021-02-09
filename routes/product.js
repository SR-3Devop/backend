const express = require("express");
const router = express.Router();


const {getProductById,
      createProduct,
      getProduct,
      photo,
      deleteProduct,
      updateProduct,
      allProducts,
      getAllUniqueCategory} = require("../controllers/product");
const { isSignedIn, isAdmin, isAuthenticated } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");




// Params 

router.param("userId",getUserById);
router.param("productId",getProductById);

//routes 

router.post("/product/create/:userId",isSignedIn,isAuthenticated,isAdmin,createProduct);
//get route
router.get("/product/:productId/",getProduct)
router.get("/product/photo/:productId",photo)
//delete routes
router.delete("/product/:productId/:userId",isSignedIn,isAuthenticated,isAdmin,deleteProduct);
//update route
router.put("/product/:productId/:userId",isSignedIn,isAuthenticated,isAdmin,updateProduct);
//listing route
router.get("/products",allProducts);
// listing the category
router.get("/products/categories",getAllUniqueCategory)
module.exports = router;