import { SigninUseCase } from '@/users/application/usecases/signin.usecase';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SigninDto implements SigninUseCase.Input {
  @ApiProperty({
    description: 'The email of the user',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
