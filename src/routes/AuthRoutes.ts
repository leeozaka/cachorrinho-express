import { Router } from 'express';
import { LoginController } from '../controllers/LoginController';

const router = Router();

router.post('/login', LoginController.authenticate);

export default router;
