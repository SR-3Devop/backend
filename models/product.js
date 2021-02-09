const mongoose = require ('mongoose');

const{Objectid} = mongoose.Schema;

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true,
        maxlength: 32,
        trim: true
    },
    description:{
        type: String,
        required:true,
        maxlength: 300,
        trim: true
    },
    price:{
        type: Number,
        required: true,
        maxlength: 10,
        trim: true
    },
    category:{
        type: Object,
        ref: "Category",
        required: true
    },
    stock:{
        type: Number,
        required: true
    },
    sold: {
        type: Number,
        required: true,
        default: 0
    },
    photo:{
        data: Buffer,
        contentType: String
    }

},
{timestamps:true}
);
module.exports = mongoose.model("Product",productSchema)