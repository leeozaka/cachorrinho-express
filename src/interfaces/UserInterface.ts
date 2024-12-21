import { User } from 'dtos/UserDTO';
import { ResultAsync } from 'neverthrow';

export interface CreateUserRequest {
  cpf: string;
  password: string;
  email: string;
  telephone: string;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface IUserRepository {
  create(data: User): Promise<User>;
  findOne(id: string): Promise<User>;
  findAll(filter?: Partial<User>): Promise<User[]>;
  update(id: string, data: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
  findByCpf(cpf: string): Promise<User | null>;
}

export interface IUserService {
  create(data: CreateUserRequest): ResultAsync<User, Error>;
  findOne(id: string): ResultAsync<User, Error>;
  findAll(filter?: Partial<User>): ResultAsync<User[], Error>;
  update(id: string, data: Partial<User>): ResultAsync<User, Error>;
  delete(id: string): ResultAsync<boolean, Error>;
  findByCpf(cpf: string): ResultAsync<User, Error>;
}
