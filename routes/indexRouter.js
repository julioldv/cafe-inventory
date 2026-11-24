import { Router } from 'express';
import * as categoriesController from '../controllers/categoriesController.js';

const indexRouter = Router();

indexRouter.get('/', categoriesController.getAllCategories);

export { indexRouter };
