import { User } from 'dtos/UserDTO';
import { Role } from '@prisma/client';
import { ActivableEntityMixin } from 'interfaces/ActivableEntityInterface';
import { UserUtils } from 'utils/UserUtils';

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

  validate(): boolean {
    return (
      this.isValidCPF() && this.isValidEmail() && this.isValidPhone() && this.isValidPassword()
    );
  }

  private isValidCPF(): boolean {
    return UserUtils.isValidCPF(this.cpf);
  }

  private isValidEmail(): boolean {
    return UserUtils.isValidEmail(this.email);
  }

  private isValidPhone(): boolean {
    return UserUtils.isValidPhone(this.telephone);
  }

  private isValidPassword(): boolean {
    return this.password ? UserUtils.isValidPassword(this.password) : false;
  }

  inactivate = ActivableEntityMixin.inactivate;
  logicalDelete = ActivableEntityMixin.logicalDelete;
  activate = ActivableEntityMixin.activate;

  toJSON(): Omit<User, 'password'> {
    const { ...user } = this;
    return user;
  }
}
