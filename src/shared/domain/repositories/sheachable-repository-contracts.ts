import { Entity } from '../entities/entity';
import { RepositoryInterface } from './repository-contracts';

// SortDirection defines the possible values for sorting direction in search queries.
export type SortDirection = 'asc' | 'desc';
// SerachProps defines the properties that can be used to filter and sort search results.
// Recives a filter of type Filter, which defaults to string.
export type SerachProps<Filter = string> = {
  page?: number;
  perPage?: number;
  sort?: string | null;
  sortDir?: SortDirection | null;
  filter?: Filter | null;
};

export class SearchParams {
  protected _page: number;
  protected _perPage = 15;
  protected _sort: string | null;
  protected _sortDir: SortDirection | null;
  protected _filter: string | null;

  constructor(props: SerachProps = {}) {
    this.page = props.page ?? 1;
    this.perPage = props.perPage;
    this.sort = props.sort ?? null;
    this.sortDir = props.sortDir ?? null;
    this.filter = props.filter ?? null;
  }

  get page(): number {
    return this._page;
  }
  private set page(value: number) {
    let _page = +value;
    if (Number.isNaN(_page) || _page <= 0 || parseInt(_page as any) !== _page) {
      _page = 1;
    }
    this._page = _page;
  }

  get perPage(): number {
    return this._perPage;
  }
  private set perPage(value: number) {
    let _perPage = +value;
    if (
      Number.isNaN(_perPage) ||
      _perPage <= 0 ||
      parseInt(_perPage as any) !== _perPage
    ) {
      _perPage = this._perPage;
    }
    this._perPage = _perPage;
  }

  get sort(): string | null {
    return this._sort;
  }
  private set sort(value: string | null) {
    this._sort =
      value === null || value === undefined || value === '' ? null : `${value}`;
  }

  get sortDir(): SortDirection | null {
    return this._sortDir;
  }
  private set sortDir(value: SortDirection | null) {
    if (!this._sort) {
      this._sortDir = null;
      return;
    }
    const dir = value?.toLowerCase();
    this._sortDir = dir !== 'asc' && dir !== 'desc' ? 'desc' : dir;
  }

  get filter(): string | null {
    return this._filter;
  }
  private set filter(value: string | null) {
    this._filter =
      value === null || value === undefined || value === '' ? null : `${value}`;
  }
}

// This interface extends the basic repository interface to include a search method.
// It is used for repositories that need to support searching entities based on some criteria.
// The SearchInput and SearchOutput types are generic, allowing for flexibility in the search criteria and
export interface SearchableRepositoryInterface<
  E extends Entity,
  SearchInput,
  SearchOutput,
> extends RepositoryInterface<E> {
  search(input: SearchParams): Promise<SearchOutput>;
}
