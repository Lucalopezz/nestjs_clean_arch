import { SignupUseCase } from '@/users/application/usecases/signup.usecase';

export class SignupDto implements SignupUseCase.Input {
  email: string;
  password: string;
  name: string;
}
