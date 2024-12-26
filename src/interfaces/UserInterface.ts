import { User } from 'dtos/UserDTO';
import { ValidationError } from 'types/ValidationErrorType';
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
  create(data: User): ResultAsync<User, Error>;
  findOne(id: string): ResultAsync<User, Error>;
  findAll(filter?: Partial<User>): ResultAsync<User[], Error>;
  update(id: string, data: Partial<User>): ResultAsync<User, Error>;
  delete(id: string): ResultAsync<boolean, Error>;
  findByCpf(cpf: string): ResultAsync<User, Error>;
}

export interface IUserService {
  create(data: CreateUserRequest): ResultAsync<User, ValidationError[] | Error>;
  findOne(id: string): ResultAsync<User, Error>;
  findAll(filter?: Partial<User>): ResultAsync<User[], Error>;
  update(id: string, data: Partial<User>): Promise<ResultAsync<User, Error>>;
  delete(id: string): ResultAsync<boolean, Error>;
  findByCpf(cpf: string): ResultAsync<User, Error>;
}
