import { ConflictError } from '@/shared/domain/errors/conflict-error';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { InMemorySearchableRepository } from '@/shared/domain/repositories/in-memory-searchable.repository';
import { SortDirection } from '@/shared/domain/repositories/sheachable-repository-contracts';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserRepository } from '@/users/domain/repositories/user.repository';

// Essa classe é uma implementação em memória do repositório de usuários.
// Ela estende a classe InMemoryRepository, que fornece funcionalidades básicas de repositório em
// memória, como inserção, busca por ID, atualização e exclusão de entidades.
// A classe UserInMemoryRepository implementa a interface UserRepository, que define métodos específicos
export class UserInMemoryRepository
  extends InMemorySearchableRepository<UserEntity>
  implements UserRepository.Repository
{
  sortableFields: string[] = ['name', 'created_at'];

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
  protected async applyFilter(
    items: UserEntity[],
    filter: UserRepository.Filter,
  ): Promise<UserEntity[]> {
    if (!filter) {
      return items;
    }
    return items.filter((item) => {
      return item.props.name.toLowerCase().includes(filter.toLowerCase());
    });
  }
  // Sobrescreve o método applySort para aplicar a ordenação dos itens
  // caso o parâmetro sort não seja fornecido.
  // Se sort for null, aplica a ordenação padrão por createdAt em ordem decrescente.
  // Caso contrário, aplica a ordenação pelo campo especificado e pela direção fornecida.
  protected async applySort(
    items: UserEntity[],
    sort: string | null,
    sortDir: SortDirection | null,
  ): Promise<UserEntity[]> {
    return !sort
      ? super.applySort(items, 'createdAt', 'desc')
      : super.applySort(items, sort, sortDir);
  }
}
