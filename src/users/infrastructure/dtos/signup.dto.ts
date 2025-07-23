import { SignupUseCase } from '@/users/application/usecases/signup.usecase';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignupDto implements SignupUseCase.Input {
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

  @ApiProperty({
    description: 'The name of the user',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
