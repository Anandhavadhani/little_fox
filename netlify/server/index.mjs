import express from 'express'
import books from '../../server/data/books.json' with { type: 'json' }
import settings from '../../server/data/settings.json' with { type: 'json' }

const app = express()

app.get('/api/books', (req, res) => {
  res.json(books)
})

app.get('/api/books/:id', (req, res) => {
  const { id } = req.params
  const book = books.find((item) => item.id === id)
  if (!book) return res.status(404).json({ message: 'Book not found', id })
  return res.json(book)
})

app.get('/api/books/:id/related', (req, res) => {
  const { id } = req.params
  if (!books.some((item) => item.id === id)) {
    return res.status(404).json({ message: 'Book not found', id })
  }
  return res.json(books.filter((item) => item.id !== id))
})

app.get('/api/settings', (req, res) => {
  res.json(settings)
})

app.use('/api', (req, res) => {
  res.status(404).json({ message: 'Not found' })
})

export const config = {
  path: '/api/*',
}

app.listen(process.env.PORT)
