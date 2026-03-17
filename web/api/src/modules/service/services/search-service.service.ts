import { Injectable } from "@nestjs/common";
import { ServiceRepository } from "../repository/service.repo";

export interface SearchFilters {
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

@Injectable()
export class SearchServiceService {
  constructor(private readonly serviceRepo: ServiceRepository) {}

  async execute(filters: SearchFilters) {
    const page = filters.page || 1;
    const limit = filters.limit || 20;

    const { data, total } = await this.serviceRepo.search({
      ...filters,
      page,
      limit,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      items: data.map((s) => s.publicData()),
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }
}
