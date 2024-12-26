import { PrismaClient } from '@prisma/client';
import { IUserRepository } from 'interfaces/UserInterface';
import { User } from 'dtos/UserDTO';
import { UserMapper } from 'mapper/UserMapper';
import { errAsync, ResultAsync, okAsync } from 'neverthrow';

/**
 * Repository implementation for User entity operations with Prisma ORM
 * Handles database operations for users including CRUD and specialized queries
 */
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Creates a user. Returns a ResultAsync with the created user or an error.
   * @param {User} data - The user data
   * @returns {ResultAsync<User, Error>}
   */
  create(data: User): ResultAsync<User, Error> {
    return ResultAsync.fromPromise(
      this.prisma.user.create({ data: UserMapper.toEntity(data) }),
      (error) => new Error('Error creating user: ' + error),
    );
  }

  /**
   * Finds a user by ID. Returns a ResultAsync with the user or an error if not found.
   * @param {string} id - The user's unique ID
   * @returns {ResultAsync<User, Error>}
   */
  findOne(id: string): ResultAsync<User, Error> {
    return ResultAsync.fromPromise(
      this.prisma.user.findUnique({ where: { id, isDeleted: false } }),
      (error) => new Error('Error finding user: ' + error),
    ).andThen((user) => {
      if (!user) return errAsync(new Error('User not found'));

      return okAsync(UserMapper.toDomain(user));
    });
  }

  /**
   * Retrieves all users matching an optional filter. Returns a ResultAsync with an array of users or an error.
   * @param {Partial<User>} [filter] - Optional filtering criteria
   * @returns {ResultAsync<User[], Error>}
   */
  findAll(filter?: Partial<User>): ResultAsync<User[], Error> {
    return ResultAsync.fromPromise(
      this.prisma.user
        .findMany({ where: { ...filter, isDeleted: false } })
        .then((users) => users.map((user) => UserMapper.toDomain(user))),
      (error) => new Error('Error: ' + error),
    );
  }

  /**
   * Updates a user by ID. Returns a ResultAsync with the updated user or an error if not found.
   * @param {string} id - The user's unique ID
   * @param {Partial<User>} data - Fields to update
   * @returns {ResultAsync<User, Error>}
   */
  update(id: string, data: Partial<User>): ResultAsync<User, Error> {
    return this.findOne(id).andThen((user) => {
      if (!user) return errAsync(new Error('User to update not found'));
      return ResultAsync.fromPromise(
        this.prisma.user.update({ where: { id }, data: { ...data } }),
        (error) => new Error('Error updating user: ' + error),
      ).map(UserMapper.toDomain);
    });
  }

  /**
   * Performs a soft delete on a user. Returns a ResultAsync with true or an error if not found.
   * @param {string} id - The user's unique ID
   * @returns {ResultAsync<boolean, Error>}
   */
  delete(id: string): ResultAsync<boolean, Error> {
    return this.findOne(id).andThen((user) => {
      if (!user) return errAsync(new Error('User to delete not found'));
      const userModel = UserMapper.toEntity(user);
      return ResultAsync.fromPromise(
        this.prisma.user.update({ where: { id }, data: { ...userModel, isDeleted: true } }),
        (error) => new Error('Error deleting user: ' + error),
      ).map(() => true);
    });
  }

  /**
   * Finds a user by CPF. Returns a ResultAsync with the user or an error if not found.
   * @param {string} cpf - The user's CPF
   * @returns {ResultAsync<User, Error>}
   */
  findByCpf(cpf: string): ResultAsync<User, Error> {
    return ResultAsync.fromPromise(
      this.prisma.user.findUnique({ where: { cpf, isDeleted: false } }),
      (error) => new Error('Error finding by CPF: ' + error),
    ).andThen((user) => {
      if (!user) 
        return errAsync(new Error('User not found'));
      
      return okAsync(UserMapper.toDomain(user));
    });
  }
}