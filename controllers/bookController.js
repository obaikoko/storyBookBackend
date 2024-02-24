import asyncHanler from 'express-async-handler';
import Book from '../model/bookModel.js';

// @desc Get All public Books
// @route GET /api/books
// @privacy Public

const getPublicBooks = asyncHanler(async (req, res) => {
  const books = await Book.find({ status: 'public' });

  if (books) {
    res.status(200);
    res.json(books);
  } else {
    res.status(200);
    res.json('No Book found');
  }
});

// @desc Get All  Private Books
// @route GET /api/books/me
// @privacy Private
const getPrivateBooks = asyncHanler(async (req, res) => {
  try {
    const books = await Book.find({ user: req.user });

    if (books) {
      res.status(200);
      res.json(books);
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc Create Stories
// @route POST /api/stories
// @privacy Private
const createBook = asyncHanler(async (req, res) => {
  const { title, author, body, status } = req.body;

  // Create Book
  const book = await Book.create({
    title,
    author: author || `${req.user.firstName} ${req.user.lastName}`,
    body,
    status,
    user: req.user._id,
  });

  if (book) {
    res.status(200);
    res.json({
      _id: book._id,
      title: book.title,
      author: book.author,
      body: book.body,
      status: book.status,
      user: book.user,
    });
  } else {
    res.status(500);
    throw new Error('Something went wrong');
  }
});

// @desc UpdatBooks
// @route POST /api/stories/id
// @privacy Private
const updateBook = asyncHanler(async (req, res) => {
  const { title, author, body, status } = req.body;
  const book = await Book.findById(req.params.id);
  if (!book) {
    res.status(404);
    throw new Error('Book not Found');
  }

  if (book && book.user.toString() === req.user._id.toString()) {
    book.title = title || book.title;
    book.author = author || book.author;
    book.body = body || book.body;
    book.status = status || book.status;

    const updatedBook = await book.save();

    res.status(200);
    res.json({
      _id: updatedBook._id,
      title: updatedBook.title,
      author: updatedBook.author,
      body: updatedBook.body,
      status: updatedBook.status,
      user: updatedBook.user,
    });
  } else {
    res.status(401);
    throw new Error('User not Authorized. Contact the Author');
  }
});

// @desc Deletes Bood
// @route POST /api/stories/id
// @privacy Private
const deleteBook = asyncHanler(async (req, res) => {
  // checks if Book exist
  const book = await Book.findById(req.params.id);
  if (!book) {
    res.status(400);
    throw new Error('Book not found');
  }
  if (book && book.user.toString() === req.user._id.toString()) {
    try {
      await Book.findByIdAndDelete(req.params.id);
      res.status(200);
      res.json(`${book.title} deleted Successfully`);
    } catch (error) {
      res.status(500);
      throw new Error('unable to delete Book, Something went wrong');
    }
  } else {
    res.status(404);
    throw new Error('User not Authorized. contact the Author');
  }
});

export { getPublicBooks, getPrivateBooks, createBook, updateBook, deleteBook };
