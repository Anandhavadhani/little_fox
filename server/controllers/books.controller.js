const fs = require('fs');
const path = require('path');

const booksPath = path.join(__dirname, '../data/books.json');

const readBooks = () => JSON.parse(fs.readFileSync(booksPath, 'utf8'));

const getAllBooks = (req, res) => {
  const books = readBooks();
  res.json(books);
};

const getBookById = (req, res) => {
  const { id } = req.params;
  const books = readBooks();
  const book = books.find((item) => item.id === id);

  if (!book) {
    return res.status(404).json({
      message: 'Book not found',
      id,
    });
  }

  return res.json(book);
};

const getRelatedBooks = (req, res) => {
  const { id } = req.params;
  const books = readBooks();
  const bookExists = books.some((item) => item.id === id);

  if (!bookExists) {
    return res.status(404).json({
      message: 'Book not found',
      id,
    });
  }

  const relatedBooks = books.filter((item) => item.id !== id);
  return res.json(relatedBooks);
};

module.exports = {
  getAllBooks,
  getBookById,
  getRelatedBooks,
};
