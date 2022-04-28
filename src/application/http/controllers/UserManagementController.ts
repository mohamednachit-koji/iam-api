import { Body, Controller, Post } from '@nestjs/common';
import { UserModelRepository } from 'infrastructure/database/repositories/UserModelRepository';
import { FetchUsersDto } from '../dtos/FetchUsersDto';
import { SearchResult } from '../dtos/SearchResult';
import { Role } from '../guards/RoleGuard';

@Controller('management/users')
export class UserManagementController {
  impersonateUser: any;
  logger: any;
  constructor(private readonly userRepository: UserModelRepository) {}

  @Role('admin')
  @Post('/search')
  public async impersonateUserRequest(
    @Body() data: FetchUsersDto,
  ): Promise<SearchResult> {
    const { filter, skip, limit } = data;
    const [users, total] = await this.userRepository.find(filter, skip, limit);
    return { data: users, total };
  }
}
