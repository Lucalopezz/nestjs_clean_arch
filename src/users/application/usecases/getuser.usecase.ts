import { UserRepository } from '@/users/domain/repositories/user.repository';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace GetUserUseCase {
  export type Input = {
    id: string;
  };
  // all user properties
  export type Output = {
    id: string;
    email: string;
    name: string;
    createdAt: Date;
  };

  export class UseCase {
    constructor(private userRepository: UserRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const entity = await this.userRepository.findById(input.id);
      return entity.toJSON();
    }
  }
}
