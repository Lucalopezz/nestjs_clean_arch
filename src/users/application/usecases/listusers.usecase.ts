import { UserRepository } from '@/users/domain/repositories/user.repository';

import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case';
import { SearchInput } from '@/shared/application/dtos/search-input';
import {
  PaginationOutput,
  PaginationOutputMapper,
} from '@/shared/application/dtos/pagination-output';
import { UserOutput, UserOutputMapper } from '../dtos/user-output.dto';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ListUsersUseCase {
  export type Input = SearchInput;

  export type Output = PaginationOutput<UserOutput>;

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private userRepository: UserRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const params = new UserRepository.SearchParams(input);
      const searchResult = await this.userRepository.search(params);
      return this.toOutput(searchResult);
    }
    private toOutput(searchResult: UserRepository.SearchResult): Output {
      const items = searchResult.items.map((user) => {
        return UserOutputMapper.toOutput(user);
      });
      return PaginationOutputMapper.toOutput<UserOutput>(items, searchResult);
    }
  }
}
