import { Role } from '@prisma/client';
import ActivableEntity from 'interfaces/ActivableEntityInterface';

export interface User extends ActivableEntity {
  id?: number;
  cpf: string;
  name: string;
  email: string;
  telephone: string;
  birthday: Date;
  password?: string;
  role: Role;
}
