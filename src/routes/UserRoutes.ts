import { Router } from 'express';
import { Container } from '../container';
import userMiddleware from 'middlewares/UserMiddleware';
import authorized from 'middlewares/auth';

const routes = Router();
const userController = Container.getUserController();

routes.post('/', userMiddleware.validateCreate, userController.create);
routes.get('/:id', authorized, userController.findOne);
routes.delete('/', authorized, userController.delete);
routes.put('/', authorized, userController.update);

export default routes;
