import { PrismaClient } from '@prisma/client';
import { IUserRepository } from 'interfaces/UserInterface';
import { User } from 'dtos/UserDTO';
import { UserMapper } from 'mapper/UserMapper';

/**
 * Repository implementation for User entity operations with Prisma ORM
 * Handles database operations for users including CRUD and specialized queries
 */
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Creates a new user in the database
   * @param data - User data transfer object
   * @returns Promise<User> - Created user
   */
  async create(data: User): Promise<User> {
    return this.prisma.user.create({ data: UserMapper.toEntity(data) });
  }

  /**
   * Finds a user by their ID
   * @param id - User's unique identifier
   * @returns Promise<User> - Found user or rejection if not found
   */
  async findOne(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id, isDeleted: false },
    });

    if (!user) {
      return Promise.reject('User not found');
    }

    return UserMapper.toDomain(user);
  }

  /**
   * Retrieves all users matching optional filter criteria
   * @param filter - Optional partial User object for filtering results
   * @returns Promise<User[]> - Array of matching users
   */
  async findAll(filter?: Partial<User>): Promise<User[]> {
    return this.prisma.user
      .findMany({
        where: { ...filter, isDeleted: false },
      })
      .then((users) => users.map((user) => UserMapper.toDomain(user)));
  }

  /**
   * Updates an existing user's information
   * @param id - User's unique identifier
   * @param data - Partial User object with fields to update
   * @returns Promise<User> - Updated user or rejection if not found
   */
  async update(id: string, data: Partial<User>): Promise<User> {
    const user = await this.findOne(id);
    if (!user) return Promise.reject('User not found');

    return this.prisma.user.update({
      where: { id },
      data: { ...data },
    });
  }

  /**
   * Performs a soft delete on a user
   * @param id - User's unique identifier
   * @returns Promise<void> - Resolves when deletion is complete
   */
  async delete(id: string): Promise<void> {
    const user = await this.findOne(id);
    if (!user) return Promise.reject('User not found');

    await this.prisma.user.update({
      where: { id },
      data: { isDeleted: true },
    });
  }

  /**
   * Finds a user by their CPF (Brazilian tax ID)
   * @param cpf - User's CPF
   * @returns Promise<User | null> - Found user or null if not found
   */
  async findByCpf(cpf: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { cpf, isDeleted: false },
    });
  }
}
