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
   * Finds a user by CPF. Returns a ResultAsync with the user or an error if not found.
   * @param {string} cpf - The user's CPF
   * @returns {ResultAsync<User, Error>}
   */
  findByCpf(cpf: string): ResultAsync<User, Error> {
    return this.userRepository.findByCpf(cpf);
  }

  /**
   * Creates a new user. Returns a ResultAsync with the created user or validation/DB errors.
   * @param {CreateUserRequest} data - The input data for user creation
   * @returns {ResultAsync<User, ValidationError[] | Error>}
   */
  create(data: CreateUserRequest): ResultAsync<User, ValidationError[] | Error> {
    const userModel = new UserModel(data);

    return userModel
      .validate()
      .andThen(() =>
        ResultAsync.fromPromise(
          hash(data.password!, 12),
          () => new Error('Failed to hash password'),
        ),
      )
      .andThen((hashedPassword: string) => {
        userModel.password = hashedPassword;
        return this.userRepository.create(UserMapper.toEntity(userModel));
      });
  }

  /**
   * Updates a user by ID. Returns a ResultAsync with the updated user or an error if not found.
   * @param {string} id - The user's unique ID
   * @param {Partial<User>} data - Fields to update
   * @returns {ResultAsync<User, Error>}
   */
  async update (id: string, data: Partial<User>): Promise<ResultAsync<User, Error>> {
    const r = await this.userRepository
      .update(id, data)
      .andThen((user) => (user ? okAsync(user) : errAsync(new Error('User not found'))));
      console.log(r);
      return r;
  }

  /**
   * Soft deletes a user. Returns a ResultAsync with true or an error if not found.
   * @param {string} id - The user's unique ID
   * @returns {ResultAsync<boolean, Error>}
   */
  delete(id: string): ResultAsync<boolean, Error> {
    return this.userRepository.delete(id);
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
   * Finds a user by ID. Returns a ResultAsync with the user or an error if not found.
   * @param {string} id - The user's unique ID
   * @returns {ResultAsync<User, Error>}
   */
  findOne(id: string): ResultAsync<User, Error> {
    return this.userRepository.findOne(id);
  }

  /**
   * Retrieves all users matching an optional filter. Returns a ResultAsync with an array of users or an error.
   * @param {Partial<User>} [filter] - Optional filtering criteria
   * @returns {ResultAsync<User[], Error>}
   */
  findAll(filter?: Partial<User>): ResultAsync<User[], Error> {
    return this.userRepository.findAll(filter);
  }
}
