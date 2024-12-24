import { User } from 'dtos/UserDTO';
import { Role } from '@prisma/client';
import { ActivableEntityMixin } from 'interfaces/ActivableEntityInterface';
import { UserUtils } from 'utils/UserUtils';
import { errAsync, okAsync, ResultAsync } from 'neverthrow';
import { ValidationError } from 'types/ValidationErrorType';

export default class UserModel implements User {
  id?: string;
  cpf: string;
  name: string;
  email: string;
  telephone: string;
  birthday: Date;
  password?: string;
  role: Role;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date | undefined;

  constructor(data: Partial<User> = {}) {
    this.id = data.id;
    this.cpf = data.cpf || '';
    this.name = data.name || '';
    this.email = data.email || '';
    this.telephone = data.telephone || '';
    this.birthday = data.birthday || new Date();
    this.password = data.password;
    this.role = data.role || Role.USER;
    this.isActive = data.isActive ?? true;
    this.isDeleted = data.isDeleted ?? false;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || undefined;
  }

  validate(): ResultAsync<boolean, ValidationError[]> {
    const validations = [
      this.isValidCPF(),
      this.isValidEmail(),
      this.isValidPhone(),
      this.isValidPassword()
    ];

    return ResultAsync.combineWithAllErrors(validations)
      .map(() => true)
      .mapErr((errors) => errors.filter((e): e is ValidationError => e !== null));
  }

  private isValidCPF(): ResultAsync<boolean, ValidationError> {
    return UserUtils.isValidCPF(this.cpf) 
      ? okAsync(true)
      : errAsync({ field: 'cpf', message: 'Invalid CPF format' });
  }

  private isValidEmail(): ResultAsync<boolean, ValidationError> {
    return UserUtils.isValidEmail(this.email)
      ? okAsync(true)
      : errAsync({ field: 'email', message: 'Invalid email format' });
  }

  private isValidPhone(): ResultAsync<boolean, ValidationError> {
    return UserUtils.isValidPhone(this.telephone)
      ? okAsync(true)
      : errAsync({ field: 'telephone', message: 'Invalid phone format' });
  }

  private isValidPassword(): ResultAsync<boolean, ValidationError> {
    return !this.password || UserUtils.isValidPassword(this.password)
      ? okAsync(true)
      : errAsync({ field: 'password', message: 'Invalid password format' });
  }

  inactivate = ActivableEntityMixin.inactivate;
  logicalDelete = ActivableEntityMixin.logicalDelete;
  activate = ActivableEntityMixin.activate;

  toJSON(): Omit<User, 'password'> {
    const { ...user } = this;
    return user;
  }
}
