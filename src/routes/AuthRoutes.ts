import { Router } from 'express';
import { Container } from 'container';

const router = Router();
const loginController = Container.getLoginController();

router.post('/', loginController.authenticate);

export default router;
