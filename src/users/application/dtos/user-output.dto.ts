import { UserEntity } from '@/users/domain/entities/user.entity';

export type UserOutput = {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
};

export class UserOutputMapper {
  static toOutput(user: UserEntity): UserOutput {
    return user.toJSON();
  }
}
