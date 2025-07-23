import { SortDirection } from '@/shared/domain/repositories/sheachable-repository-contracts';
import { ListUsersUseCase } from '@/users/application/usecases/listusers.usecase';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class ListUsersDto implements ListUsersUseCase.Input {
  @ApiPropertyOptional({
    description: 'The page number for pagination',
  })
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({
    description: 'The quantity of items per page number for pagination',
  })
  @IsOptional()
  perPage?: number;

  @ApiPropertyOptional({
    description: 'Definid colum to sort the results',
  })
  @IsOptional()
  sort?: string;

  @ApiPropertyOptional({
    description: 'The direction to sort the results (asc or desc)',
  })
  @IsOptional()
  sortDir?: SortDirection;

  @ApiPropertyOptional({
    description: 'The filter/search term to apply on the results',
  })
  @IsOptional()
  filter?: string;
}
