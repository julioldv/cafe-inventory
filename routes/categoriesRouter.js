import { Router } from 'express';
import { param } from 'express-validator';
import { body } from 'express-validator';
import * as categoriesController from '../controllers/categoriesController.js';

const validateCategoryId = param('categoryId')
  .isInt({ min: 1, max: 2147483647 })
  .withMessage('Invalid ID')
  .bail()
  .toInt();

const validateCreateCategory = [
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

  body('description')
    .optional({ values: 'null' })
    .isString()
    .withMessage('Description must be a string')
    .bail()
    .trim()
    .customSanitizer((value) => (value === '' ? null : value)),
];

const categoriesRouter = Router();

categoriesRouter.get('/new', categoriesController.getNewCategoryForm);
categoriesRouter.post('/new', validateCreateCategory, categoriesController.createCategory);
categoriesRouter.get('/:categoryId', validateCategoryId, categoriesController.getCategoryDetails);

export { categoriesRouter };
