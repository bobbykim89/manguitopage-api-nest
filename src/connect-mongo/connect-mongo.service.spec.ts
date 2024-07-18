import { Test, TestingModule } from '@nestjs/testing';
import { ConnectMongoService } from './connect-mongo.service';

describe('ConnectMongoService', () => {
  let service: ConnectMongoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConnectMongoService],
    }).compile();

    service = module.get<ConnectMongoService>(ConnectMongoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
