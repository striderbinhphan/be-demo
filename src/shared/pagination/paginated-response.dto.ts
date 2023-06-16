export class PaginatedResponseDto<T> {
  constructor(data: T[], page: number, size: number, totalElements: number) {
    this.data = data;
    this.page = page;
    this.size = size;
    this.totalElements = totalElements;
    this.totalPages = Math.ceil(this.totalElements / this.size);
  }

  data: T[];

  page: number;

  size: number;

  totalElements: number;

  totalPages: number;
}
