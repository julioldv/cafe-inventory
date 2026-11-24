import * as db from '../db/queries.js';

async function getAllCategories(req, res) {
  const categories = await db.getAllCategories();
  res.render('index', { categories });
}

export { getAllCategories };
