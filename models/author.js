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
    bookCount: {
        type: Number,
        default: 0
    },
    timestamp : {
        type :Date,
        default : Date.now
    }

});

module.exports = mongoose.model("Author", authorSchema);