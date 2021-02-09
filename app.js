require('dotenv').config()

const express = require('express');

const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// my route 
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order')
const paymentRoutes = require('./routes/paymentRoutes');
//DB 
const app = express();
mongoose.connect(`mongodb+srv://santo:${process.env.PASSWORD}@lco.jjhap.mongodb.net/LCO?retryWrites=true&w=majority`, {  
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true


}).then(() => {
    console.log("CONNECTED TO DB");
});

//MIDDLEWARE
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//ROUTES
app.use("/api",authRoutes);
app.use ("/api",userRoutes);
app.use ("/api",categoryRoutes);
app.use ("/api",productRoutes);
app.use("/api/",orderRoutes);
app.use("/api/",paymentRoutes);
//PORT
const port = process.env.PORT || 4000;

//SERVER
app.listen(port,() => {
    console.log(`Port is running at ${port}`);
}) 