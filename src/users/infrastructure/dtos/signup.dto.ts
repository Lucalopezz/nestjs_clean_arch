import { SignupUseCase } from '@/users/application/usecases/signup.usecase';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignupDto implements SignupUseCase.Input {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
