import { Entity } from '../entities/entity';
import { RepositoryInterface } from './repository-contracts';
import { NotFoundError } from '../errors/not-found-error';

export abstract class InMemoryRepository<E extends Entity>
  implements RepositoryInterface<E>
{
  items: E[] = [];

  async insert(entity: E): Promise<void> {
    this.items.push(entity);
  }

  async findById(id: string): Promise<E> {
    return this._get(id);
  }
  async findAll(): Promise<E[]> {
    return this.items;
  }

  async update(entity: E): Promise<void> {
    await this._get(entity.id);
    const index = this.items.findIndex((item) => item.id === entity.id); // position of the item in the array
    this.items[index] = entity;
  }

  async delete(id: string): Promise<void> {
    await this._get(id);
    const index = this.items.findIndex((item) => item.id === id);
    this.items.splice(index, 1); // remove the item from the array
  }

  protected async _get(id: string): Promise<E> {
    const _id = id.toString();
    const entity = this.items.find((item) => item.id === _id);
    if (!entity) {
      throw new NotFoundError(`Entity not found`);
    }
    return entity;
  }
}
