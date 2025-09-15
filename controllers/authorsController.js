const author = require("../models/author");

const getAllAuthors = async (req, res) => {
    try {
        const authors = await author.find();
        res.status(200).json(authors);
    }catch(error){
        res.status(500).json({message : error.message});
    }
    
};
const getAuthor = async (req, res) => {
    try{
        const author = await Author.findById(req.params.id);
       if(!author){
        return res.status(404).json({message :"author not found"});
       }
        res.status(200).json(authors);
    }catch(error){
        res.status(500).json({message : error.message});
    }
    
};
const createAuthor = async (req,res) =>{
    try {
        const author = await author.create(req.body);
        res.status(200).json(author)
    }catch (error){
        res.status(500).json({message : error.message});
    }
};
const updateAuthor = async (req,res)=>{
    try {
        const author = await author.findByIdAndUpdate(req.params.id,
             req.body,
            {new : true});
            if(!author){
                return res.status(404).json({message :"author not found"});
            }
            res.status(200).json(author);
    } catch (error) {
        res.status(500).json({message : error.message});
    }
}
 const deleteAuthor = async (req,res)=>{
    try {
        const author = await author.findByIdAndDelete(req.params.id);
            if(!author){
                return res.status(404).json({message :"author not found"});
            }
            res.status(200).json(author);
    } catch (error) {
        res.status(500).json({message : error.message});
    }
 }
module.exports = {
    getAllAuthors,
    createAuthor,
    getAuthor,
    updateAuthor,
    deleteAuthor
}