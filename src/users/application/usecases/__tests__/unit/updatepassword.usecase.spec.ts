import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { HashProvider } from '@/shared/application/providers/hash-provider';
import { InvalidPasswordError } from '@/shared/application/errors/invalid-password-error';
import { UserDataBuilder } from '@/users/domain/entities/testing/helpers/user-data-builder';
import { BcryptjsHashProvider } from '@/shared/application/providers/bcryptjs-hash.provider';
import { UpdatePasswordUseCase } from '../../updatepassword.usecase';

describe('UpdatePasswordUseCase unit tests', () => {
  let sut: UpdatePasswordUseCase.UseCase;
  let repository: UserInMemoryRepository;
  let hashProvider: HashProvider;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    hashProvider = new BcryptjsHashProvider();
    sut = new UpdatePasswordUseCase.UseCase(repository, hashProvider);
  });

  it('Should throws error when entity not found', async () => {
    await expect(() =>
      sut.execute({
        id: 'fakeId',
        password: 'test password',
        oldPassword: 'old password',
      }),
    ).rejects.toThrow(new NotFoundError('Entity not found'));
  });

  it('Should throws error when old password not provided', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    repository.items = [entity];
    await expect(() =>
      sut.execute({
        id: entity._id,
        password: 'test password',
        oldPassword: '',
      }),
    ).rejects.toThrow(
      new InvalidPasswordError('Old password and new password are required'),
    );
  });

  it('Should throws error when new password not provided', async () => {
    const entity = new UserEntity(UserDataBuilder({ password: '1234' }));
    repository.items = [entity];
    await expect(() =>
      sut.execute({
        id: entity._id,
        password: '',
        oldPassword: '1234',
      }),
    ).rejects.toThrow(
      new InvalidPasswordError('Old password and new password are required'),
    );
  });

  it('Should throws error when new old password does not match', async () => {
    const hashPassword = await hashProvider.generateHash('1234');
    const entity = new UserEntity(UserDataBuilder({ password: hashPassword }));
    repository.items = [entity];
    await expect(() =>
      sut.execute({
        id: entity._id,
        password: '4567',
        oldPassword: '123456',
      }),
    ).rejects.toThrow(new InvalidPasswordError('Old password does not match'));
  });

  it('Should update a password', async () => {
    const hashPassword = await hashProvider.generateHash('1234');
    const spyUpdate = jest.spyOn(repository, 'update');
    const items = [new UserEntity(UserDataBuilder({ password: hashPassword }))];
    repository.items = items;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const result = await sut.execute({
      id: items[0]._id,
      password: '4567',
      oldPassword: '1234',
    });

    const updatedEntity = repository.items.find(
      (item) => item._id === items[0]._id,
    );
    const checkNewPassword = await hashProvider.compareHash(
      '4567',
      updatedEntity?.password ?? '',
    );
    expect(spyUpdate).toHaveBeenCalledTimes(1);
    expect(checkNewPassword).toBeTruthy();
  });
});
