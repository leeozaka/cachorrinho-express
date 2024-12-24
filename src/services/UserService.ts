import { CreateUserRequest, IUserRepository, IUserService } from 'interfaces/UserInterface';
import { hash } from 'bcrypt';
import { errAsync, okAsync, ResultAsync } from 'neverthrow';
import { User } from 'dtos/UserDTO';
import UserModel from 'models/UserModel';
import { UserMapper } from 'mapper/UserMapper';
import { ValidationError } from 'types/ValidationErrorType';

export class UserService implements IUserService {
  constructor(private readonly userRepository: IUserRepository) {}

  /**
   * Finds a user by their CPF (Brazilian tax ID)
   * @param cpf - The CPF to search for
   * @returns ResultAsync<User, Error> - Success: User object, Error: Not implemented
   */
  findByCpf(cpf: string): ResultAsync<User, Error> {
    throw new Error('Method not implemented.' + cpf);
  }

  /**
   * Creates a new user
   * @param data - CreateUserRequest containing user details and password
   * @returns ResultAsync<User, ValidationError[] | Error> - Success: Created user, Error: Validation or DB errors
   */
  create(data: CreateUserRequest): ResultAsync<User, ValidationError[] | Error> {
    const userModel = new UserModel(data);

    return userModel.validate()
      .andThen(() => 
        ResultAsync.fromPromise(
          hash(data.password!, 12),
          () => new Error('Failed to hash password')
        )
      )
      .andThen((hashedPassword: string) => {
        userModel.password = hashedPassword;
        return ResultAsync.fromPromise(
          this.userRepository.create(UserMapper.toEntity(userModel)),
          (error) => new Error(`Failed to create user: ${error}`)
        );
      });
  }

  /**
   * Updates an existing user
   * @param id - User ID to update
   * @param data - Partial User object with fields to update
   * @returns ResultAsync<User, Error> - Success: Updated user, Error: Not found or DB errors
   */
  update(id: string, data: Partial<User>): ResultAsync<User, Error> {
    const user = ResultAsync.fromPromise(
      this.userRepository.findOne(id),
      () => new Error('User not found'),
    );

    return user.andThen(() => {
      return ResultAsync.fromPromise(
        this.userRepository.update(id, data),
        () => new Error('Database error'),
      );
    });
  }

  /**
   * Performs a logical deletion of a user
   * @param id - User ID to delete
   * @returns ResultAsync<boolean, Error> - Success: true, Error: Not found or deletion failed
   */
  delete(id: string): ResultAsync<boolean, Error> {
    return ResultAsync.fromPromise(
      this.userRepository.findOne(id),
      () => new Error('User not found'),
    ).andThen((user) => {
      const userToDelete = new UserModel(user);
      userToDelete.logicalDelete();

      return ResultAsync.fromPromise(
        this.userRepository.update(id, userToDelete),
        () => new Error('Failed to delete user'),
      ).map(() => true);
    });
  }

  // async changePassword(id: string, oldPassword: string, newPassword: string): Promise<void> {
  //   const user = await this.userRepository.findOne(id);
  //   if (!user) throw new NotFoundError('User');
  //
  //   if (!UserUtils.isValidPassword(newPassword)) {
  //     throw new ValidationError('Invalid password format');
  //   }
  //
  //   if (!(await compare(oldPassword, user.password!))) {
  //     throw new ValidationError('Incorrect old password');
  //   }
  //
  //   await this.userRepository.update(id, {
  //     password: await hash(newPassword, 12),
  //   });
  // }

  /**
   * Finds a single user by ID
   * @param id - User ID
   * @returns ResultAsync<User, Error> - Success: User object, Error: Invalid CPF or not found
   */
  findOne(id: string): ResultAsync<User, Error> {
    return ResultAsync.fromPromise(
      this.userRepository.findOne(id),
      () => new Error('Internal server error'),
    ).andThen((user) => {
      if (!user) return errAsync(new Error('User not found'));
      return okAsync(user);
    });
  }

  /**
   * Retrieves all users with optional filtering
   * @param filter - Optional partial User object for filtering results
   * @returns ResultAsync<User[], Error> - Success: Array of users, Error: Server error
   */
  findAll(filter?: Partial<User>): ResultAsync<User[], Error> {
    return ResultAsync.fromPromise(
      this.userRepository.findAll(filter),
      () => new Error('Internal Server Error'),
    );
  }
}
