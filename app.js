require ('dotenv').config();
const express = require("express");
const app = express();
const connectDB = require("./config/database");
connectDB();

app.use(express.json());

const authorRoutes = require("./routes/authorRoutes");
const booksRoutes = require("./routes/booksRoutes");

app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.use("/api/authors", authorRoutes);
app.use("/api/books", booksRoutes);
const PORT = process.env.PORT ||3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

module.exports = app; // Export for testing purposes