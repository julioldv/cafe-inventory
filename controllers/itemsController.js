import { validationResult } from 'express-validator';
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

export { getItemDetails };
