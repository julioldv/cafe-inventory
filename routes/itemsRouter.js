import { Router } from 'express';
import { param } from 'express-validator';
import * as itemsController from '../controllers/itemsController.js';

const validateItemId = param('itemId')
  .isInt({ min: 1, max: 2147483647 })
  .withMessage('Invalid ID')
  .bail()
  .toInt();

const itemsRouter = Router();

itemsRouter.get('/:itemId', validateItemId, itemsController.getItemDetails);

export { itemsRouter };
