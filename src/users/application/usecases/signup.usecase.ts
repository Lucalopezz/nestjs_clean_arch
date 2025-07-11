import { HashProvider } from '@/shared/application/providers/hash-provider';
import { BadRequestError } from '@/shared/application/errors/bad-request-error';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserRepository } from '@/users/domain/repositories/user.repository';
import { UserOutput, UserOutputMapper } from '../dtos/user-output.dto';
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace SignupUseCase {
  export type Input = {
    email: string;
    password: string;
    name: string;
  };
  export type Output = UserOutput;

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(
      private userRepository: UserRepository.Repository,
      private hashProvider: HashProvider,
    ) {}

    async execute(input: Input): Promise<Output> {
      const { email, password, name } = input;

      if (!email || !password || !name) {
        throw new BadRequestError('Input data not provided');
      }

      await this.userRepository.emailExists(email);
      const hashPassword = await this.hashProvider.generateHash(password);

      const entity = new UserEntity(
        Object.assign(input, {
          password: hashPassword,
        }),
      );
      await this.userRepository.insert(entity);
      return UserOutputMapper.toOutput(entity);
    }
  }
}
