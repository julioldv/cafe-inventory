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

async function getEditCategoryForm(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).send('Invalid category ID');
  }

  const categoryId = req.params.categoryId;
  const category = await db.getCategoryById(categoryId);

  if (!category) {
    return res.status(404).send('Category not found');
  }

  return res.render('editCategory', {
    categoryId: category.id,
    errors: [],
    values: {
      name: category.name,
      description: category.description ?? '',
    },
  });
}

async function updateCategory(req, res) {
  const errors = validationResult(req);
  const validationErrors = errors.array();

  const hasInvalidId = validationErrors.some((error) => error.location === 'params');

  if (hasInvalidId) {
    return res.status(400).send('Invalid category ID');
  }

  const categoryId = req.params.categoryId;

  const values = {
    name: typeof req.body?.name === 'string' ? req.body.name : '',
    description: typeof req.body?.description === 'string' ? req.body.description : '',
  };

  if (!errors.isEmpty()) {
    const category = await db.getCategoryById(categoryId);

    if (!category) {
      return res.status(404).send('Category not found');
    }

    return res.status(400).render('editCategory', {
      categoryId,
      errors: validationErrors,
      values,
    });
  }

  const categoryData = matchedData(req, {
    locations: ['body'],
    includeOptionals: true,
  });

  try {
    const category = await db.updateCategory(categoryId, categoryData);

    if (!category) {
      return res.status(404).send('Category not found');
    }

    return res.redirect(303, `/categories/${category.id}`);
  } catch (error) {
    if (error.code === '23505' && error.constraint === 'categories_name_key') {
      return res.status(409).render('editCategory', {
        categoryId,
        errors: [
          {
            msg: 'A category with this name already exists',
            path: 'name',
          },
        ],
        values,
      });
    }

    throw error;
  }
}

export {
  getAllCategories,
  getCategoryDetails,
  getNewCategoryForm,
  createCategory,
  getEditCategoryForm,
  updateCategory,
};
