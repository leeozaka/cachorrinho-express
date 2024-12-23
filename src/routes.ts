import AddressRoutes from 'routes/AddressRoutes';
import UserRoutes from 'routes/UserRoutes';
import AuthRoutes from 'routes/AuthRoutes';
import { Router } from 'express';

const routes = Router();

routes.use('/user', UserRoutes);
routes.use('/address', AddressRoutes);
routes.use('/login', AuthRoutes);

export default routes;
