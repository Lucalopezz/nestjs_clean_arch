import { Exclude, Expose } from 'class-transformer';
import { PaginationPresenter } from './pagination.presenter';

// Base presenter for paginated collections.
// Exposes "meta" (pagination info) and requires "data" via getData().
export abstract class CollectionPresenter {
  @Exclude()
  protected paginationPresenter: PaginationPresenter;

  constructor(props: PaginationPresenter) {
    this.paginationPresenter = new PaginationPresenter(props);
  }

  @Expose({ name: 'meta' })
  getMeta() {
    return this.paginationPresenter;
  }

  abstract getData();
}
// {
//   "meta": {
//     "total": 100,
//     "page": 1,
//     "perPage": 10
//   },
//   "data": [ ... ]
// }
