import { UserEntity } from '../entities/user.entity';
import { SearchableRepositoryInterface } from '@/shared/domain/repositories/sheachable-repository-contracts';

// This interface defines the contract for a User repository.
// It extends the SearchableRepositoryInterface to include methods specific to UserEntity.
// The methods include finding a user by email and checking if an email already exists.
export interface UserRepository
  extends SearchableRepositoryInterface<UserEntity, any, any> {
  findByEmail(email: string): Promise<UserEntity>;
  emailExists(email: string): Promise<void>;
}
