/* eslint-disable @typescript-eslint/no-unused-vars */
import { UserRepository } from '@/users/domain/repositories/user.repository';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { EnvConfigModule } from '@/shared/infrastructure/env-config/env-config.module';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import request from 'supertest';
import { instanceToPlain } from 'class-transformer';
import { applyGlobalConfig } from '@/global-config';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UsersModule } from '@/users/infrastructure/users.module';
import { setupPrismaTests } from '@/shared/infrastructure/database/testing/setup-prisma-tests';
import { UsersController } from '@/users/infrastructure/users.controller';
import { UpdateUserDto } from '@/users/infrastructure/dtos/update-user.dto';
import { UserDataBuilder } from '@/users/domain/entities/testing/helpers/user-data-builder';

describe('UsersController e2e tests', () => {
  let app: INestApplication;
  let module: TestingModule;
  let repository: UserRepository.Repository;
  let updateUserDto: UpdateUserDto;
  const prismaService = new PrismaClient();
  let entity: UserEntity;

  beforeAll(async () => {
    setupPrismaTests();
    module = await Test.createTestingModule({
      imports: [
        EnvConfigModule,
        UsersModule,
        DatabaseModule.forTest(prismaService),
      ],
    }).compile();
    app = module.createNestApplication();
    applyGlobalConfig(app);
    await app.init();
    repository = module.get<UserRepository.Repository>('UserRepository');
  });

  beforeEach(async () => {
    updateUserDto = {
      name: 'test name',
    };
    await prismaService.user.deleteMany();
    entity = new UserEntity(UserDataBuilder({}));
    await repository.insert(entity);
  });

  describe('PUT /users/:id', () => {
    it('should update a user', async () => {
      updateUserDto.name = 'test name';
      const res = await request(app.getHttpServer())
        .put(`/users/${entity._id}`)
        .send(updateUserDto)
        .expect(200);
      const user = await repository.findById(entity._id);
      const presenter = UsersController.userToResponse(user.toJSON());
      const serialized = instanceToPlain(presenter);
      expect(res.body.data).toStrictEqual(serialized);
    });

    it('should return a error with 422 code when the request body is invalid', async () => {
      const res = await request(app.getHttpServer())
        .put(`/users/${entity._id}`)
        .send({})
        .expect(422);
      expect(res.body.error).toBe('Unprocessable Entity');
      expect(res.body.message).toEqual([
        'name should not be empty',
        'name must be a string',
      ]);
    });

    it('should return a error with 404 code when throw NotFoundError with invalid id', async () => {
      const res = await request(app.getHttpServer())
        .put('/users/fakeId')
        .send(updateUserDto)
        .expect(404)
        .expect({
          statusCode: 404,
          error: 'Not Found',
          message: 'UserModel not found using ID fakeId',
        });
    });
  });
});
