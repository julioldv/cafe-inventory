import { validationResult, matchedData } from 'express-validator';
import * as db from '../db/queries.js';

async function getItemDetails(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send('Invalid item ID');
  }

  const requestedItemId = req.params.itemId;
  const item = await db.getItemById(requestedItemId);

  if (!item) {
    return res.status(404).send('Item not found');
  }

  return res.render('item', { item });
}

async function getNewItemForm(req, res) {
  const categories = await db.getAllCategories();

  return res.render('newItem', {
    categories,
    errors: [],
    values: {
      name: '',
      category_id: '',
      quantity: '',
      unit: '',
    },
  });
}

async function createItem(req, res) {
  const errors = validationResult(req);

  const toFormValue = (value) =>
    typeof value === 'string' || typeof value === 'number' ? String(value) : '';

  const values = {
    name: toFormValue(req.body?.name),
    category_id: toFormValue(req.body?.category_id),
    quantity: toFormValue(req.body?.quantity),
    unit: toFormValue(req.body?.unit),
  };

  if (!errors.isEmpty()) {
    const categories = await db.getAllCategories();

    return res.status(400).render('newItem', {
      errors: errors.array(),
      values,
      categories,
    });
  }

  const itemData = matchedData(req, {
    locations: ['body'],
  });

  try {
    const item = await db.createItem(itemData);

    return res.redirect(303, `/categories/${item.category_id}`);
  } catch (error) {
    if (error.code === '23503' && error.constraint === 'items_category_id_fkey') {
      const categories = await db.getAllCategories();

      return res.status(409).render('newItem', {
        errors: [
          {
            msg: 'The selected category no longer exists. Please select another category.',
            path: 'category_id',
          },
        ],
        values,
        categories,
      });
    }

    throw error;
  }
}

export { getItemDetails, getNewItemForm, createItem };
