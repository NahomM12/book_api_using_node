const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app'); // We will need to export app from app.js
const Book = require('../models/book');
const Author = require('../models/author');

let mongoServer;
let authorId;

// Setup: Before all tests, connect to an in-memory database
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    // Create a dummy author to use in tests
    const author = await Author.create({ name: 'J.R.R. Tolkien', nationality: 'British' });
    authorId = author._id;
});

// Teardown: After all tests, disconnect from the database
afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

// Cleanup: After each test, clear the books collection
afterEach(async () => {
    await Book.deleteMany({});
});

describe('Book API', () => {
    describe('POST /api/books', () => {
        it('should create a new book and return 201', async () => {
            const newBook = {
                title: 'The Hobbit',
                author: authorId,
                publishYear: 1937,
                genre: 'Fantasy'
            };

            const res = await request(app)
                .post('/api/books')
                .send(newBook);

            expect(res.statusCode).toEqual(201);
            expect(res.body.title).toBe('The Hobbit');
            expect(res.body.author.toString()).toBe(authorId.toString());
        });

        it('should return 500 if required fields are missing', async () => {
            const newBook = { author: authorId }; // Missing title
            const res = await request(app)
                .post('/api/books')
                .send(newBook);
            expect(res.statusCode).toEqual(500);
        });
    });

    describe('GET /api/books', () => {
        beforeEach(async () => {
            // Seed the database for GET tests
            await Book.insertMany([
                { title: 'The Fellowship of the Ring', author: authorId, publishYear: 1954, genre: 'Fantasy' },
                { title: 'The Two Towers', author: authorId, publishYear: 1954, genre: 'Fantasy' },
                { title: 'The Return of the King', author: authorId, publishYear: 1955, genre: 'Epic' }
            ]);
        });

        it('should return all books with pagination defaults', async () => {
            const res = await request(app).get('/api/books');
            expect(res.statusCode).toEqual(200);
            expect(res.body.books.length).toBe(3);
            expect(res.body.totalBooks).toBe(3);
            expect(res.body.currentPage).toBe(1);
        });

        it('should filter books by genre', async () => {
            const res = await request(app).get('/api/books?genre=Epic');
            expect(res.statusCode).toEqual(200);
            expect(res.body.books.length).toBe(1);
            expect(res.body.books[0].title).toBe('The Return of the King');
        });

        it('should sort books by publishYear descending', async () => {
            const res = await request(app).get('/api/books?sortBy=publishYear&order=desc');
            expect(res.statusCode).toEqual(200);
            expect(res.body.books[0].title).toBe('The Return of the King');
        });

        it('should handle pagination correctly', async () => {
            const res = await request(app).get('/api/books?page=2&limit=2');
            expect(res.statusCode).toEqual(200);
            expect(res.body.books.length).toBe(1);
            expect(res.body.currentPage).toBe(2);
            expect(res.body.books[0].title).toBe('The Return of the King');
        });
    });

    describe('GET /api/books/:id', () => {
        it('should return a single book by id', async () => {
            const book = await Book.create({ title: 'Test Book', author: authorId });
            const res = await request(app).get(`/api/books/${book._id}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body.title).toBe('Test Book');
        });

        it('should return 404 for a non-existent book id', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            const res = await request(app).get(`/api/books/${nonExistentId}`);
            expect(res.statusCode).toEqual(404);
        });
    });

    describe('PUT /api/books/:id', () => {
        it('should update a book and return it', async () => {
            const book = await Book.create({ title: 'Original Title', author: authorId });
            const updatedData = { title: 'Updated Title' };

            const res = await request(app)
                .put(`/api/books/${book._id}`)
                .send(updatedData);

            expect(res.statusCode).toEqual(200);
            expect(res.body.title).toBe('Updated Title');
        });
    });

    describe('DELETE /api/books/:id', () => {
        it('should delete a book and return it', async () => {
            const book = await Book.create({ title: 'To Be Deleted', author: authorId });
            const res = await request(app).delete(`/api/books/${book._id}`);
            
            expect(res.statusCode).toEqual(200);
            expect(res.body.title).toBe('To Be Deleted');

            const findRes = await request(app).get(`/api/books/${book._id}`);
            expect(findRes.statusCode).toEqual(404);
        });
    });
});
