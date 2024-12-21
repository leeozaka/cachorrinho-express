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
      ...user,
    } as PrismaUser;
  }
}
