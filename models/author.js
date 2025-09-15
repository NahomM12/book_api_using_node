const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema({
    name:{
        type : String,
        required : true
    },
    nationality : {
        type : String,
        required : true
    },
    timestamp : {
        type :Date,
        default : Date.now
    }

});

module.exports = mongoose.model("Author", authorSchema);