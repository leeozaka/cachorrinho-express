import { Role } from '@prisma/client';
import { ActivableEntityType } from 'types/ActivableEntityType';

export interface User extends ActivableEntityType {
  id?: string;
  cpf: string;
  name: string;
  email: string;
  telephone: string;
  birthday: Date;
  password?: string;
  role: Role;
}

export interface CreateUserDTO extends Omit<User, 'id' | keyof ActivableEntityType> {
  password: string;
}

export type UpdateUserDTO = Partial<Omit<User, 'id' | 'cpf' | 'password'>>;
