const express = require("express");
const router = express.Router();
const {
    getAllBooks,
    createBook,
    getBook,
    updateBook,
    deleteBook
} = require("../controllers/bookController");

router.route("/").get(getAllBooks)
.post(createBook);
router.route("/:id").get(getBook)
.put(updateBook)
.delete(deleteBook);

module.exports = router;