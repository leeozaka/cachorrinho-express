import { User } from 'dtos/UserDTO';
import { Role } from '@prisma/client';
import { ActivableEntityMixin } from 'interfaces/ActivableEntityInterface';
import { UserUtils } from 'utils/UserUtils';
import { errAsync, okAsync, ResultAsync } from 'neverthrow';
import { ValidationError } from 'types/ValidationErrorType';

type UserModelParams = Partial<User>;

export default class UserModel implements User {
  readonly id?: string;
  readonly cpf: string;
  
  readonly name: string;
  readonly email: string;
  readonly telephone: string;
  readonly birthday: Date;
  
  password?: string;
  readonly role: Role;
  
  public isActive: boolean;
  public isDeleted: boolean;
  
  readonly createdAt: Date;
  updatedAt: Date | undefined;

  constructor(data: UserModelParams = {}) {
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
    this.updatedAt = data.updatedAt;
  }


  validate(): ResultAsync<boolean, ValidationError[]> {
    const validations = [
      this.validateCPF(),
      this.validateEmail(),
      this.validatePhone(),
      this.validatePassword(),
    ];

    return ResultAsync.combineWithAllErrors(validations)
      .map(() => true)
      .mapErr((errors) => errors.filter((e): e is ValidationError => e !== null));
  }

  private validateCPF(): ResultAsync<boolean, ValidationError> {
    return UserUtils.isValidCPF(this.cpf)
      ? okAsync(true)
      : errAsync({ field: 'cpf', message: 'Invalid CPF format' });
  }

  private validateEmail(): ResultAsync<boolean, ValidationError> {
    return UserUtils.isValidEmail(this.email)
      ? okAsync(true)
      : errAsync({ field: 'email', message: 'Invalid email format' });
  }

  private validatePhone(): ResultAsync<boolean, ValidationError> {
    return UserUtils.isValidPhone(this.telephone)
      ? okAsync(true)
      : errAsync({ field: 'telephone', message: 'Invalid phone format' });
  }

  private validatePassword(): ResultAsync<boolean, ValidationError> {
    return !this.password || UserUtils.isValidPassword(this.password)
      ? okAsync(true)
      : errAsync({ field: 'password', message: 'Invalid password format' });
  }

  inactivate = ActivableEntityMixin.inactivate;
  logicalDelete = ActivableEntityMixin.logicalDelete;
  activate = ActivableEntityMixin.activate;
}
