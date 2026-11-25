import { Router } from 'express';
import { param } from 'express-validator';
import { body } from 'express-validator';
import * as itemsController from '../controllers/itemsController.js';

const validateItemId = param('itemId')
  .isInt({ min: 1, max: 2147483647 })
  .withMessage('Invalid ID')
  .bail()
  .toInt();

const validateCreateItem = [
  body('name')
    .isString()
    .withMessage('Name must be a string')
    .bail()
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .bail()
    .isLength({ max: 50 })
    .withMessage('Name must not exceed 50 characters'),

  body('category_id')
    .isString()
    .withMessage('Category must be a string')
    .bail()
    .isInt({ min: 1, max: 2147483647 })
    .withMessage('Please select a valid category')
    .bail()
    .toInt(),

  body('quantity')
    .isString()
    .withMessage('Quantity must be a string')
    .bail()
    .isInt({ min: 0, max: 2147483647 })
    .withMessage('Quantity must be a non-negative integer')
    .bail()
    .toInt(),

  body('unit')
    .isString()
    .withMessage('Unit must be a string')
    .bail()
    .isIn(['g', 'ml', 'pcs'])
    .withMessage('Unit must be g, ml or pcs'),
];

const itemsRouter = Router();

itemsRouter.get('/new', itemsController.getNewItemForm);
itemsRouter.post('/new', validateCreateItem, itemsController.createItem);
itemsRouter.get('/:itemId', validateItemId, itemsController.getItemDetails);

export { itemsRouter };
