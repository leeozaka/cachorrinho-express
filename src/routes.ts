import AddressRoutes from 'routes/AddressRoutes';
import UserRoutes from 'routes/UserRoutes';
import { Router } from 'express';
import { login } from 'middlewares/login';

const routes = Router();

routes.use('/user', UserRoutes);
routes.use('/address', AddressRoutes);

routes.use('/login', login);

export default routes;
