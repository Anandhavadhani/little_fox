const express = require('express');
const {
  getAllBooks,
  getBookById,
  getRelatedBooks,
} = require('../controllers/books.controller');

const router = express.Router();

router.get('/', getAllBooks);
router.get('/:id', getBookById);
router.get('/:id/related', getRelatedBooks);

module.exports = router;
