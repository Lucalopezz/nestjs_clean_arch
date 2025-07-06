import { ConflictError } from '@/shared/domain/errors/conflict-error';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { InMemorySearchableRepository } from '@/shared/domain/repositories/in-memory-searchable.repository';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserRepository } from '@/users/domain/repositories/user.repository';

// Essa classe é uma implementação em memória do repositório de usuários.
// Ela estende a classe InMemoryRepository, que fornece funcionalidades básicas de repositório em
// memória, como inserção, busca por ID, atualização e exclusão de entidades.
// A classe UserInMemoryRepository implementa a interface UserRepository, que define métodos específicos
export class UserInMemoryRepository
  extends InMemorySearchableRepository<UserEntity>
  implements UserRepository
{
  async findByEmail(email: string): Promise<UserEntity> {
    const entity = this.items.find((item) => item.email === email);
    if (!entity) {
      throw new NotFoundError(`Entity not found using email: ${email}`);
    }
    return entity;
  }
  async emailExists(email: string): Promise<void> {
    const entity = this.items.find((item) => item.email === email);
    if (entity) {
      throw new ConflictError('Email address already used');
    }
  }
}
