import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import mongoose from 'mongoose';
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from '@nestjs/platform-fastify';
import * as multipart from '@fastify/multipart';
import * as pactum from 'pactum';
import { AuthInputDto } from '../src/auth/dto';
import {
  UserInputDto,
  NewPwInputDto,
  NewUsernameInputDto,
} from '../src/users/dto';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as FormData from 'form-data-lite';

describe('AppController (e2e)', () => {
  let app: NestFastifyApplication;
  const db = mongoose.connect(process.env.DB_URL);
  const adminPhrase: string = process.env.ADMIN_PHRASE_SECRET;

  const imgPath = path.resolve(__dirname, 'manguito_tree.jpeg');
  const form = new FormData();
  form.append('image', fs.readFileSync(imgPath), {
    filename: 'manguito_tree.jpeg',
    // contentType: 'image/jpeg',
  });
  form.append('content', 'testing content text');

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    await app.register(multipart, {
      attachFieldsToBody: true,
      limits: {
        fileSize: 1024 * 1024 * 10,
        files: 1,
      },
    });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
    await app.listen(3000);
    (await db).connection.db.dropDatabase();
    pactum.request.setBaseUrl('http://localhost:3000');
  });
  afterAll(async () => {
    app.close();
  });

  describe('User', () => {
    const userDto: UserInputDto = {
      email: 'manguito@gmail.com',
      password: '1234qwerASDF!',
      name: 'Manguito',
    };
    const authDto: AuthInputDto = {
      email: 'manguito@gmail.com',
      password: '1234qwerASDF!',
    };
    const userNameDto: NewUsernameInputDto = {
      username: 'Manguito Lovebird',
    };
    const newPwDto: NewPwInputDto = {
      currentPassword: '1234qwerASDF!',
      newPassword: '1234qwerASDF!@',
    };
    describe('Signup', () => {
      it('should throw error if email empty', async () => {
        return pactum
          .spec()
          .post('/users')
          .withBody({
            name: userDto.name,
            password: userDto.password,
          })
          .expectStatus(400);
      });
      it('should throw error if password empty', async () => {
        return pactum
          .spec()
          .post('/users')
          .withBody({
            email: userDto.email,
            name: userDto.name,
          })
          .expectStatus(400);
      });
      it('should throw error if name empty', async () => {
        return pactum
          .spec()
          .post('/users')
          .withBody({
            email: userDto.email,
            password: userDto.password,
          })
          .expectStatus(400);
      });
      it('should throw if no body provided', async () => {
        return pactum.spec().post('/users').expectStatus(400).inspect();
      });
      it('should signup', async () => {
        return pactum.spec().post('/users').withBody(userDto).expectStatus(201);
      });
    });
    describe('Signin', () => {
      it('should throw error if email empty', async () => {
        return pactum
          .spec()
          .post('/auth')
          .withBody({
            password: userDto.password,
          })
          .expectStatus(400);
      });
      it('should throw error if password empty', async () => {
        return pactum
          .spec()
          .post('/auth')
          .withBody({
            email: userDto.email,
          })
          .expectStatus(400);
      });
      it('should throw error if no body provided', async () => {
        return pactum.spec().post('/auth').expectStatus(400).inspect();
      });
      it('should signin', async () => {
        return pactum
          .spec()
          .post('/auth')
          .withBody(authDto)
          .expectStatus(200)
          .stores('userToken', 'access_token');
      });
    });
    describe('Get current user', () => {
      it('should get current user', async () => {
        return pactum
          .spec()
          .get('/auth')
          .withHeaders({
            Authorization: '$S{userToken}',
          })
          .expectStatus(200);
      });
    });
    describe('Update username', () => {
      it('should edit username', async () => {
        return pactum
          .spec()
          .put('/users/username')
          .withHeaders({
            Authorization: '$S{userToken}',
          })
          .withBody(userNameDto)
          .expectStatus(200)
          .expectBodyContains(userNameDto.username);
      });
    });
    describe('Update password', () => {
      it('should edit password', async () => {
        return pactum
          .spec()
          .put('/users/password')
          .withHeaders({
            Authorization: '$S{userToken}',
          })
          .withBody(newPwDto)
          .expectStatus(200);
      });
    });
    describe('Set admin', () => {
      it('should fail to set user to admin', async () => {
        return pactum
          .spec()
          .put('/users/setadmin')
          .withHeaders({
            Authorization: '$S{userToken}',
          })
          .withBody({
            adminPhrase: 'wrong admin phrase',
          })
          .expectStatus(403);
      });
      it('should set user to admin', async () => {
        return pactum
          .spec()
          .put('/users/setadmin')
          .withHeaders({
            Authorization: '$S{userToken}',
          })
          .withBody({
            adminPhrase: adminPhrase,
          })
          .expectStatus(200);
      });
    });
  });

  describe('Post', () => {
    describe('Get empty posts', () => {
      it('should get posts', async () => {
        return pactum.spec().get('/post').expectStatus(200).withBody([]);
      });
    });

    // describe('Create new post', () => {
    //   it('should create post', async () => {
    //     return await pactum
    //       .spec()
    //       .post('/post')
    //       .withHeaders({
    //         Authorization: '$S{userToken}',
    //       })
    //       .withMultiPartFormData(form)
    //       .expectStatus(201);
    //   });
    // });
  });
});
