require('dotenv').config();
const express = require('express');
const cors = require('cors');
const booksRoutes = require('./routes/books.routes');
const settingsRoutes = require('./routes/settings.routes');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    app: 'Little Fox API',
    status: 'running',
  });
});

app.use('/api/books', booksRoutes);
app.use('/api/settings', settingsRoutes);

app.listen(port, () => {
  console.log(`Little Fox server listening on http://localhost:${port}`);
});
