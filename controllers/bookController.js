const book = require("../models/book");

const getAllBooks = async (req, res) =>{
try{
const books = await book.find();
    res.status(200).json(books);
}catch(error){
    res.status(500).json({message : error.message});
}
};

const getBook = async (req, res) =>{
    try{
        const book = await book.findbyId(req.params.id);
        if(!book){
            return res.status(404).json({message :"book not found"});
        }
        res.status(200).json(book);
    }catch (error)
    {
        res.status(500).json({message : error.message});
    }
};
const updateBook = async (req,res) =>
    {
        try {
            const book = await book.findByIdAndUpdate(req.params.id,
                 req.body,
                {new : true});
                if(!book){
                    return res.status(404).json({message :"book not found"});
                }
                res.status(200).json(book);
        } catch (error) {
            res.status(500).json({message : error.message});
        }
    };
    const createBook = async (req,res) =>
    {
        try {
            const book = await book.create(req.body);
            res.status(200).json(book)
        }catch (error){
            res.status(500).json({message : error.message});
        }
    };
    const deleteBook = async (req,res) =>
    {
        try {
            const book = await book.findByIdAndDelete(req.params.id);
            if(!book){
                return res.status(404).json({message :"book not found"});
            }
            res.status(200).json(book);
        } catch (error) {
            res.status(500).json({message : error.message});
        }
    };

module.exports = {
    getAllBooks,
    createBook,
    getBook,
    updateBook,
    deleteBook
}
