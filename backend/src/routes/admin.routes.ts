import { Router } from 'express';
import {
  createProduct,
  updateProduct,
  deactivateProduct,
  listProducts,
} from '../controllers/product.controller';
import { listAllOrders, updateOrderStatus } from '../controllers/order.controller';
import { listUsers, toggleUserStatus } from '../controllers/user.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// Todas as rotas admin exigem autenticação E papel ADMIN
router.use(authenticate, requireAdmin);

// Produtos
router.get('/products', listProducts);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deactivateProduct);

// Pedidos
router.get('/orders', listAllOrders);
router.patch('/orders/:id/status', updateOrderStatus);

// Usuários
router.get('/users', listUsers);
router.patch('/users/:id/toggle', toggleUserStatus);

export default router;

