import { User as PrismaUser } from '@prisma/client';
import { User } from '../dtos/UserDTO';
import { ActivableEntityMapper } from './ActivableEntityMapper';

export class UserMapper {
  static toDomain(prismaUser: PrismaUser): User {
    const user = ActivableEntityMapper.toDomain<User>(prismaUser);

    return {
      ...user,
      birthday: new Date(prismaUser.birthday),
    } as User;
  }

  static toEntity(user: User): PrismaUser {
    return {
      id: user.id,
      cpf: user.cpf,
      name: user.name,
      email: user.email,
      telephone: user.telephone,
      birthday: user.birthday,
      password: user.password,
      role: user.role,
      isActive: user.isActive,
      isDeleted: user.isDeleted,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    } as PrismaUser;
  }
}
