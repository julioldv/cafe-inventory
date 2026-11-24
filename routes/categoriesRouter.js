import { Router } from 'express';
import { param } from 'express-validator';
import * as categoriesController from '../controllers/categoriesController.js';

const validateCategoryId = param('categoryId')
  .isInt({ min: 1, max: 2147483647 })
  .withMessage('El ID de la categoría no es válido')
  .bail()
  .toInt();

const categoriesRouter = Router();

categoriesRouter.get('/:categoryId', validateCategoryId, categoriesController.getItemsByCategory);

export { categoriesRouter };
