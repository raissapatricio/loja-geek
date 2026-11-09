import { Router } from 'express';
import {
  listProducts,
  listCategories,
  getProduct,
} from '../controllers/product.controller';

const router = Router();

router.get('/', listProducts);
router.get('/categories', listCategories);
router.get('/:id', getProduct);

export default router;

