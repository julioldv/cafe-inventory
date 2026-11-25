import { Router } from 'express';
import { param } from 'express-validator';
import * as categoriesController from '../controllers/categoriesController.js';

const validateCategoryId = param('categoryId')
  .isInt({ min: 1, max: 2147483647 })
  .withMessage('Invalid ID')
  .bail()
  .toInt();

const categoriesRouter = Router();

categoriesRouter.get('/:categoryId', validateCategoryId, categoriesController.getCategoryDetails);

export { categoriesRouter };
