import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { FixtureModule } from 'src/modules/fixture/fixture.module';
import { Fixture } from 'src/entities';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('Integration Test - Fixtures', () => {
  let app: INestApplication;
  let fixtureModel: Fixture;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [FixtureModule],
    }).compile();

    fixtureModel = moduleFixture.get(getRepositoryToken(Fixture));
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200).expect('Hello World!');
  });
});
