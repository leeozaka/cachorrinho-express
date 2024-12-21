import { PrismaClient } from '@prisma/client';
import { UserRepository } from 'repositories/UserRepository';
import { UserService } from 'services/UserService';
import { UserController } from 'controllers/UserController';

export class Container {
  private static prisma: PrismaClient;
  private static userRepository: UserRepository;
  private static userService: UserService;
  private static userController: UserController;

  static init() {
    this.prisma = new PrismaClient();
    this.userRepository = new UserRepository(this.prisma);
    this.userService = new UserService(this.userRepository);
    this.userController = new UserController(this.userService);
  }

  static getUserController(): UserController {
    if (!this.userController) this.init();
    return this.userController;
  }

  static async disconnect() {
    await this.prisma?.$disconnect();
  }
}
