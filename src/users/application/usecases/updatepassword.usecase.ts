import { UserRepository } from '@/users/domain/repositories/user.repository';
import { UserOutput, UserOutputMapper } from '../dtos/user-output.dto';
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case';
import { InvalidPasswordError } from '@/shared/application/errors/invalid-password-error';
import { HashProvider } from '@/shared/application/providers/hash-provider';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace UpdatePasswordUseCase {
  export type Input = {
    id: string;
    password: string;
    oldPassword: string;
  };

  export type Output = UserOutput;

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(
      private userRepository: UserRepository.Repository,
      private hashProvider: HashProvider,
    ) {}

    async execute(input: Input): Promise<Output> {
      const entity = await this.userRepository.findById(input.id);
      if (!input.oldPassword || !input.password) {
        throw new InvalidPasswordError(
          'Old password and new password are required',
        );
      }
      const checkOldPassword = await this.hashProvider.compareHash(
        input.oldPassword,
        entity.password,
      );
      if (!checkOldPassword) {
        throw new InvalidPasswordError('Old password does not match');
      }
      const hashedPassword = await this.hashProvider.generateHash(
        input.password,
      );
      // DDD concept: Entity should handle its own state changes
      entity.updatePassword(hashedPassword);
      await this.userRepository.update(entity);
      return UserOutputMapper.toOutput(entity);
    }
  }
}
