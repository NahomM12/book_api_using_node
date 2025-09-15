const mongoose = require ("mongoose");

const bookSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "author",
        required : true
    },
    publishYear: {
        type : Number
    },
     timestamp : {
        type :Date,
        default : Date.now
    }
});

module.exports = mongoose.model("Book", bookSchema);