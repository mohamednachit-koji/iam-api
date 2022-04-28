export class FetchUsersDto {
  skip: number;
  limit: number;
  filter: Record<string, any>;
}
