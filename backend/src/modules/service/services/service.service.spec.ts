import { Test, TestingModule } from '@nestjs/testing';
import { ServiceService } from './service.service';
import ServiceRepository from '../repository/service.repo';
import FakeServiceRepository from '../repository/fake.service.repo';
import { UserModule } from '../../user/user.module';
import { JwtModule } from '@nestjs/jwt';

describe('ServiceService', () => {
  let service: ServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceService,
        {
          provide: ServiceRepository,
          useClass: FakeServiceRepository,
        },
      ],
      imports: [UserModule, JwtModule.register({ global: true })],
    }).compile();

    service = module.get<ServiceService>(ServiceService);
  });

  it('Deve ser definido', () => {
    expect(service).toBeDefined();
  });

  it('Deve criar um serviço', async () => {
    const newService = await service.create({
      name: 'Serviço Teste',
      description: 'Descrição do serviço teste',
      price: 100,
      providerId: '1',
    });

    expect(newService).toHaveProperty('price', 100);
    expect(newService).toHaveProperty('name', 'Serviço Teste');
  });

  it('Deve buscar um serviço por ID', async () => {
    const createdService = await service.create({
      name: 'Serviço Teste',
      description: 'Descrição do serviço teste',
      price: 100,
      providerId: '1',
    });

    const foundService = await service.findById(createdService.id);
    expect(foundService).toHaveProperty('id', createdService.id);
  });

  it('Deve atualizar um serviço', async () => {
    const createdService = await service.create({
      name: 'Serviço Teste',
      description: 'Descrição do serviço teste',
      price: 100,
      providerId: '1',
    });

    const updatedService = await service.update({
      id: createdService.id,
      name: 'Serviço Atualizado',
      description: 'Descrição atualizada',
      price: 150,
      providerId: '1',
    });

    expect(updatedService).toHaveProperty('name', 'Serviço Atualizado');
    expect(updatedService).toHaveProperty('price', 150);
  });

  it('Deve buscar todos os serviços', async () => {
    await service.create({
      name: 'Serviço 1',
      description: 'Descrição do serviço 1',
      price: 100,
      providerId: '1',
    });

    await service.create({
      name: 'Serviço 2',
      description: 'Descrição do serviço 2',
      price: 200,
      providerId: '1',
    });

    const services = await service.findAll();
    expect(services.length).toBeGreaterThanOrEqual(2);
  });

  it('Deve buscar serviços por ID do provedor', async () => {
    const providerId = '2';

    await service.create({
      name: 'Serviço A',
      description: 'Descrição do serviço A',
      price: 100,
      providerId,
    });

    await service.create({
      name: 'Serviço B',
      description: 'Descrição do serviço B',
      price: 200,
      providerId,
    });

    const services = await service.findbyProviderId(providerId);
    expect(services.length).toBe(2);
    services.forEach((s) => expect(s.providerId).toBe(providerId));
  });

  it('Deve lançar erro ao atualizar serviço inexistente', async () => {
    await expect(
      service.update({
        id: 'non-existent-id',
        name: 'Serviço Inexistente',
        description: 'Descrição',
        price: 100,
        providerId: '1',
      }),
    ).rejects.toThrow('O serviço não foi encontrado');
  });

  it('Deve lançar erro ao buscar serviço inexistente por ID', async () => {
    await expect(service.findById('non-existent-id')).rejects.toThrow(
      'O serviço não foi encontrado',
    );
  });

  it('Deve lançar erro ao buscar serviços por provedor inexistente', async () => {
    await expect(
      service.findbyProviderId('non-existent-provider'),
    ).rejects.toThrow('O prestador não foi encontrado');
  });

  it('Deve lançar erro ao criar serviço com provedor inexistente', async () => {
    await expect(
      service.create({
        name: 'Serviço Teste',
        description: 'Descrição do serviço teste',
        price: 100,
        providerId: 'non-existent-provider',
      }),
    ).rejects.toThrow('O prestador não foi encontrado');
  });

  it('Deve lançar erro ao atualizar serviço com provedor inexistente', async () => {
    await expect(
      service.update({
        id: 'some-id',
        name: 'Serviço Teste',
        description: 'Descrição do serviço teste',
        price: 100,
        providerId: 'non-existent-provider',
      }),
    ).rejects.toThrow('O prestador não foi encontrado');
  });

  it('Deve deletar um serviço', async () => {
    const createdService = await service.create({
      name: 'Serviço a ser deletado',
      description: 'Descrição do serviço a ser deletado',
      price: 100,
      providerId: '1',
    });

    await service.delete(createdService.id);

    await expect(service.findById(createdService.id)).rejects.toThrow(
      'O serviço não foi encontrado',
    );
  });

  it('Deve lançar erro ao deletar serviço inexistente', async () => {
    await expect(service.delete('non-existent-id')).rejects.toThrow(
      'O serviço não foi encontrado',
    );
  });
});
