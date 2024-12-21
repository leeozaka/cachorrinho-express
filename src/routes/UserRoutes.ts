import { Router } from 'express';
import UserController from 'controllers/UserController';
import usuarioMiddleware from 'middlewares/UserMiddleware';
import authorized from 'middlewares/auth';

const routes = Router();
const userController = new UserController();

routes.post('/', usuarioMiddleware.validateCreate, userController.create);
routes.get('/', authorized, userController.getProfile);
routes.delete('/', authorized, userController.delete);
routes.put('/', authorized, userController.update);

export default routes;
