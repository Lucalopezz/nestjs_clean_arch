import { Entity } from '@/shared/domain/entities/entity';
import { UserValidatorFactory } from '../validators/user.validator';
import { EntityValidationError } from '@/shared/domain/errors/validation-error';

export type UserProps = {
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
};

export class UserEntity extends Entity<UserProps> {
  constructor(
    public readonly props: UserProps,
    id?: string,
  ) {
    UserEntity.validade(props);
    super(props, id);
    this.props.createdAt = this.props.createdAt ?? new Date();
  }
  update(value: string): void {
    UserEntity.validade({ ...this.props, name: value });
    this.name = value;
  }
  updatePassword(value: string): void {
    UserEntity.validade({ ...this.props, password: value });
    this.password = value;
  }
  get name(): string {
    return this.props.name;
  }
  private set name(value: string) {
    this.props.name = value;
  }
  get email(): string {
    return this.props.email;
  }
  get password(): string {
    return this.props.password;
  }
  private set password(value: string) {
    this.props.password = value;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }
  static validade(data: UserProps) {
    // esse método é estático para ser chamado sem instanciar a classe
    const userValidator = UserValidatorFactory.create();
    const isValid = userValidator.validate(data); //validando os dados do usuário
    if (!isValid) {
      throw new EntityValidationError(userValidator.errors);
    }
  }
}
