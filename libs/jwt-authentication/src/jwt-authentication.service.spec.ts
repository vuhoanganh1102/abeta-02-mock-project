import { Test, TestingModule } from '@nestjs/testing';
import { sign } from 'jsonwebtoken';
import { JwtAuthenticationModule } from './jwt-authentication.module';
import { JwtAuthenticationService } from './jwt-authentication.service';

describe('JwtAuthenticationService', () => {
  let service: JwtAuthenticationService;
  const ACCESS_TOKEN = 'THIS_IS_SOME_TOKEN';
  const SECRET_KEY = '65b1232145fca2f092c42cea00cc7ec9adaaa';

  const mock = {
    request: {
      headers: {
        authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    },
    user: {
      id: 1,
    },
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtAuthenticationModule.register({
          secretOrKey: SECRET_KEY,
          accessTokenExpiredIn: '10m',
          refreshTokenExpiredIn: '365d',
        }),
      ],
      providers: [],
    }).compile();

    service = module.get<JwtAuthenticationService>(JwtAuthenticationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Can extract token from Bearer', () => {
    const result = service.extractFromAuthHeaderAsBearerToken(mock.request);
    expect(result).toEqual(ACCESS_TOKEN);
  });

  it('Should be verify correct token assign decoded to payload', () => {
    const correctToken = sign(mock.user, SECRET_KEY, { algorithm: 'HS256' });

    mock.request.headers.authorization = correctToken;

    service.validateRequest(mock.request);
    expect(mock.request.payload.id).toEqual(mock.user.id);
  });

  it('Should be throw error when secret wrong', () => {
    const wrongToken = 'THIS_IS_WRONG_TOKEN';
    mock.request.headers.authorization = wrongToken;

    expect(service.validateRequest(mock.request)).rejects.toThrowError();
  });
});
