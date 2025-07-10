import { BadRequestError } from '@/shared/domain/errors/bad-request-error';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserRepository } from '@/users/domain/repositories/user.repository';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace SignupUseCase {
  export type Input = {
    email: string;
    password: string;
    name: string;
  };
  export type Output = {
    id: string;
    email: string;
    name: string;
    createdAt: Date;
  };

  export class UseCase {
    constructor(private userRepository: UserRepository.Repository) {}
    async execute(input: Input): Promise<Output> {
      const { email, password, name } = input;

      if (!email || !password || !name) {
        throw new BadRequestError('Input data not provided');
      }

      await this.userRepository.emailExists(email);

      const entity = new UserEntity(input);
      await this.userRepository.insert(entity);
      return entity.toJSON();
    }
  }
}
