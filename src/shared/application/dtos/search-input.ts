import { SortDirection } from '@/shared/domain/repositories/sheachable-repository-contracts';

export type SearchInput<Filter = string> = {
  page?: number;
  perPage?: number;
  sort?: string;
  sortDir?: SortDirection | null;
  filter?: Filter | null;
};
