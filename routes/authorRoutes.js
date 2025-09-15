const express = require("express");
const router = express.Router();
const {
    getAllAuthors,
    createAuthor,
    getAuthor,
    updateAuthor,
    deleteAuthor
} = require("../controllers/authorsController");

router.route("/").get(getAllAuthors)
.post(createAuthor);
router.route("/:id").get(getAuthor)
.put(updateAuthor)
.delete(deleteAuthor);

module.exports = router;
