const book = require("../models/book");

const getAllBooks = async (req, res) =>{
    try{
        // Destructure query parameters for filtering, sorting, and pagination
        const { title, author, genre, publishYear, sortBy, order, page, limit } = req.query;
        const filter = {};

        // --- Filtering Logic ---
        if (title) {
            // Use regex for a case-insensitive search on the title
            filter.title = { $regex: title, $options: 'i' };
        }
        if (author) { filter.author = author; }
        if (genre) {
            filter.genre = { $regex: genre, $options: 'i' };
        }
        if (publishYear) { filter.publishYear = publishYear; }

        // --- Sorting Logic ---
        const sortOptions = {};
        const sortField = sortBy || 'title'; // Default sort by title
        const sortOrder = order === 'desc' ? -1 : 1; // Default order ascending
        sortOptions[sortField] = sortOrder;

        // --- Pagination Logic ---
        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 10; // Default to 10 items per page
        const skip = (pageNum - 1) * limitNum;

        // --- Database Query ---
        const books = await book.find(filter)
            .populate('author', 'name')
            .sort(sortOptions)
            .skip(skip)
            .limit(limitNum);

        // Get total count of documents matching the filter for pagination metadata
        const totalBooks = await book.countDocuments(filter);

        res.status(200).json({
            totalBooks,
            totalPages: Math.ceil(totalBooks / limitNum),
            currentPage: pageNum,
            books
        });
    }catch(error){
        res.status(500).json({message : error.message});
    }
};

const getBook = async (req, res) =>{
    try{
        const book = await book.findById(req.params.id);
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
            res.status(201).json(book)
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
