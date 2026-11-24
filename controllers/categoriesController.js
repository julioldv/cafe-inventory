import { validationResult } from 'express-validator';
import * as db from '../db/queries.js';

async function getAllCategories(req, res) {
  const categories = await db.getAllCategories();
  res.render('index', { categories });
}

async function getItemsByCategory(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send('Invalid category ID');
  }
  const requestedCategoryId = req.params.categoryId;
  const category = await db.getCategoryById(requestedCategoryId);

  if (!category) {
    return res.status(404).send('Category not found');
  }

  const items = await db.getItemsByCategoryId(requestedCategoryId);

  return res.render('category', { category, items });
}

export { getAllCategories, getItemsByCategory };
