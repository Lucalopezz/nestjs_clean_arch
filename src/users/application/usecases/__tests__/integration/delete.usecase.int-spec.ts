/* eslint-disable @typescript-eslint/no-unused-vars */
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { UserPrismaRepository } from '@/users/infrastructure/database/prisma/repositories/user-prisma.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { DeleteUserUseCase } from '../../deleteuser.usecase';
import { setupPrismaTests } from '@/shared/infrastructure/database/testing/setup-prisma-tests';
import { UserDataBuilder } from '@/users/domain/entities/testing/helpers/user-data-builder';

describe('DeleteUseCase integration tests', () => {
  const prismaService = new PrismaClient();
  let sut: DeleteUserUseCase.UseCase;
  let repository: UserPrismaRepository;
  let module: TestingModule;

  beforeAll(async () => {
    setupPrismaTests();
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();
    repository = new UserPrismaRepository(prismaService as any);
  });

  beforeEach(async () => {
    sut = new DeleteUserUseCase.UseCase(repository);
    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should throws error when entity not found', async () => {
    await expect(() => sut.execute({ id: 'fakeId' })).rejects.toThrow(
      new NotFoundError('UserModel not found using ID fakeId'),
    );
  });

  it('should delete a user', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    const newUser = await prismaService.user.create({
      data: entity.toJSON(),
    });
    await sut.execute({ id: entity._id });

    const output = await prismaService.user.findUnique({
      where: {
        id: entity._id,
      },
    });
    expect(output).toBeNull();
    const models = await prismaService.user.findMany();
    expect(models).toHaveLength(0);
  });
});
