/* eslint-disable @typescript-eslint/no-namespace */
import { UserEntity } from '../entities/user.entity';
import {
  SearchParams as DefaultSearchParams,
  SearchResult as DefaultSearchResult,
  SearchableRepositoryInterface,
} from '@/shared/domain/repositories/sheachable-repository-contracts';

export namespace UserRepository {
  export type Filter = string;
  // The SearchParams class extends the DefaultSearchParams class, allowing for custom filtering
  export class SearchParams extends DefaultSearchParams<Filter> {}
  // The SearchResult class extends the DefaultSearchResult class, allowing for custom filtering
  // and includes UserEntity as the entity type.
  export class SearchResult extends DefaultSearchResult<UserEntity, Filter> {}
  // This cannot be necessary because can be passed as a generic type, or importing from the shared module.

  // This interface defines the contract for a User repository.
  // It extends the SearchableRepositoryInterface to include methods specific to UserEntity.
  // The methods include finding a user by email and checking if an email already exists.
  export interface Repository
    extends SearchableRepositoryInterface<
      UserEntity,
      Filter,
      SearchParams,
      SearchResult
    > {
    findByEmail(email: string): Promise<UserEntity>;
    emailExists(email: string): Promise<void>;
  }
}
// UserRepository.Repository is how to use the UserRepository interface
