import { LoginService } from './services/LoginService';
import { PrismaClient } from '@prisma/client';
import { UserRepository } from 'repositories/UserRepository';
import { UserService } from 'services/UserService';
import { UserController } from 'controllers/UserController';
import { LoginController } from 'controllers/LoginController';

export class Container {
  private static prisma: PrismaClient;
  private static userRepository: UserRepository;
  private static userService: UserService;
  private static userController: UserController;

  private static loginController: LoginController;
  private static loginService: LoginService;

  static init() {
    this.prisma = new PrismaClient();
    this.userRepository = new UserRepository(this.prisma);
    this.userService = new UserService(this.userRepository);
    this.userController = new UserController(this.userService);

    this.loginService = new LoginService();
    this.loginController = new LoginController(this.loginService);
  }

  static getUserController(): UserController {
    if (!this.userController) this.init();
    return this.userController;
  }

  static getLoginController(): LoginController {
    if (!this.loginController) this.init();
    return this.loginController;
  }

  static async disconnect() {
    await this.prisma?.$disconnect();
  }
}
