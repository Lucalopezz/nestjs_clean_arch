import { CollectionPresenter } from '@/shared/infrastructure/presenters/collection.presenter';
import { UserOutput } from '@/users/application/dtos/user-output.dto';
import { ListUsersUseCase } from '@/users/application/usecases/listusers.usecase';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class UserPresenter {
  @ApiProperty({
    description: 'The ID of the user',
  })
  id: string;

  @ApiProperty({
    description: 'The name of the user',
  })
  name: string;

  @ApiProperty({
    description: 'The email of the user',
  })
  email: string;

  @ApiProperty({
    description: 'The date of creation of the user',
  })
  @Transform(({ value }: { value: Date }) => value.toISOString())
  createdAt: Date;

  constructor(output: UserOutput) {
    this.id = output.id;
    this.name = output.name;
    this.email = output.email;
    this.createdAt = output.createdAt;
  }
}

export class UserCollerctionPresenter extends CollectionPresenter {
  data: UserPresenter[];
  constructor(output: ListUsersUseCase.Output) {
    const { items, ...paginationProps } = output;
    super(paginationProps);
    this.data = items.map((item) => new UserPresenter(item));
  }
}
