import { UpdatePasswordUseCase } from '@/users/application/usecases/updatepassword.usecase';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePasswordDto
  implements Omit<UpdatePasswordUseCase.Input, 'id'>
{
  @ApiProperty({
    description: 'The new password of the user',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'The old password of the user',
  })
  @IsString()
  @IsNotEmpty()
  oldPassword: string;
}
