import { BaseEntity } from "@shared/entities/base.entity";

export interface ProviderProps {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface ServiceProps {
  id?: string;
  providerId: string;
  provider?: ProviderProps;
  name: string;
  description: string;
  price: number;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class ServiceEntity extends BaseEntity {
  providerId: string;
  provider?: ProviderProps;
  name: string;
  description: string;
  price: number;
  isActive: boolean;

  constructor(props: ServiceProps) {
    super(props.id, props.createdAt, props.updatedAt);
    if (!props.providerId) {
      throw new Error("Serviço deve ter um prestador associado");
    }

    if (!props.name || props.name.trim().length < 2) {
      throw new Error("Nome do serviço inválido");
    }

    if (!props.description || props.description.trim().length < 5) {
      throw new Error("Descrição do serviço inválida");
    }

    if (props.price <= 0) {
      throw new Error("Preço do serviço deve ser maior que zero");
    }

    this.providerId = props.providerId;
    this.provider = props.provider;
    this.name = props.name.trim();
    this.description = props.description.trim();
    this.price = props.price;
    this.isActive = props.isActive ?? true;
  }

  activate(): void {
    this.isActive = true;
    this.touch();
  }

  deactivate(): void {
    this.isActive = false;
    this.touch();
  }

  updateDetails(name: string, description: string, price: number): void {
    if (!name || name.trim().length < 2) {
      throw new Error("Nome do serviço inválido");
    }
    if (!description || description.trim().length < 5) {
      throw new Error("Descrição do serviço inválida");
    }
    if (price <= 0) {
      throw new Error("Preço do serviço deve ser maior que zero");
    }

    this.name = name.trim();
    this.description = description.trim();
    this.price = price;
    this.touch();
  }

  isOwnedBy(providerId: string): boolean {
    return this.providerId === providerId;
  }

  publicData() {
    return {
      id: this.id,
      providerId: this.providerId,
      provider: this.provider,
      name: this.name,
      description: this.description,
      price: this.price,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
