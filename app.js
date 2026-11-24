import express from 'express';

const app = express();

app.get('/', (req, res) => res.send('<h1>Cafe Inventory Index</h1>'));

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Listening on port ${PORT}`);
});
