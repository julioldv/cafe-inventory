import { validationResult } from 'express-validator';
import { matchedData } from 'express-validator';
import * as db from '../db/queries.js';

async function getAllCategories(req, res) {
  const categories = await db.getAllCategories();
  res.render('index', { categories });
}

async function getCategoryDetails(req, res) {
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

function getNewCategoryForm(req, res) {
  res.render('newCategory', {
    errors: [],
    values: {
      name: '',
      description: '',
    },
  });
}

async function createCategory(req, res, next) {
  const errors = validationResult(req);

  const values = {
    name: typeof req.body?.name === 'string' ? req.body.name : '',
    description: typeof req.body?.description === 'string' ? req.body.description : '',
  };

  if (!errors.isEmpty()) {
    return res.status(400).render('newCategory', {
      errors: errors.array(),
      values,
    });
  }

  const categoryData = matchedData(req, {
    locations: ['body'],
    includeOptionals: true,
  });

  try {
    await db.createCategory(categoryData);
  } catch (error) {
    if (error.code === '23505' && error.constraint === 'categories_name_key') {
      return res.status(409).render('newCategory', {
        errors: [
          {
            msg: 'A category with this name already exists',
            path: 'name',
          },
        ],
        values,
      });
    }

    return next(error);
  }

  return res.redirect(303, '/');
}

export { getAllCategories, getCategoryDetails, getNewCategoryForm, createCategory };
