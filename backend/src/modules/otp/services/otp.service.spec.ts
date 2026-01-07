import { Test, TestingModule } from '@nestjs/testing';
import { OtpService } from './otp.service';
import OtpRepository from '../repository/otp.repo';
import FakeOtpRepository from '../repository/fake/fake-otp.repo';
import { OtpPurpose } from '../entities/otp.entity';

describe('OtpService', () => {
  let service: OtpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OtpService,
        {
          provide: OtpRepository,
          useClass: FakeOtpRepository,
        },
      ],
    }).compile();

    service = module.get<OtpService>(OtpService);
  });

  it('Deve estar definido', () => {
    expect(service).toBeDefined();
  });

  it('Deve gerar um OTP', async () => {
    const otp = await service.generate('2', OtpPurpose.ACCOUNT_ACTIVATION);
    expect(otp).toBeDefined();
    expect(otp.userId).toBe('2');
    expect(otp.purpose).toBe(OtpPurpose.ACCOUNT_ACTIVATION);
    expect(otp.code).toHaveLength(6);
  });

  it('Deve validar um OTP válido', async () => {
    const generatedOtp = await service.generate(
      '3',
      OtpPurpose.CHANGE_PASSWORD,
    );
    const validatedOtp = await service.validate(
      '3',
      generatedOtp.code,
      OtpPurpose.CHANGE_PASSWORD,
    );
    expect(validatedOtp).toBeDefined();
    expect(validatedOtp.id).toBe(generatedOtp.id);
  });

  it('Deve falhar ao validar um OTP inválido', async () => {
    await expect(
      service.validate('4', '000000', OtpPurpose.CHANGE_PASSWORD),
    ).rejects.toThrow('OTP inválido ou expirado');
  });

  it('Deve falhar ao validar um OTP já usado', async () => {
    const generatedOtp = await service.generate(
      '1',
      OtpPurpose.CHANGE_PASSWORD,
    );
    await service.validate('1', generatedOtp.code, OtpPurpose.CHANGE_PASSWORD);
    await expect(
      service.validate('1', generatedOtp.code, OtpPurpose.CHANGE_PASSWORD),
    ).rejects.toThrow('OTP inválido ou expirado');
  });

  // Este teste presisa de mudar o tempo no service para 3 segundos para não
  // demorar muito nos testes
  // it('Deve falhar ao validar um OTP expirado', async () => {
  //   const generatedOtp = await service.generate(
  //     '2',
  //     OtpPurpose.CHANGE_PASSWORD,
  //   );
  //   await new Promise((resolve) => setTimeout(resolve, 4 * 1000));
  //   await expect(
  //     service.validate('2', generatedOtp.code, OtpPurpose.CHANGE_PASSWORD),
  //   ).rejects.toThrow('OTP inválido ou expirado');
  // });
});
