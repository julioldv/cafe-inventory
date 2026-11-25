import express from 'express';
import path from 'node:path';

import { indexRouter } from './routes/indexRouter.js';
import { categoriesRouter } from './routes/categoriesRouter.js';
import { itemsRouter } from './routes/itemsRouter.js';

const app = express();

app.set('views', path.join(import.meta.dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/', indexRouter);
app.use('/categories', categoriesRouter);
app.use('/items', itemsRouter);

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Listening on port ${PORT}`);
});
