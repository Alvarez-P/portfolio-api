import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import {
  IResponse,
  IGetListResponse,
  IGetOneResponse
} from '../../interceptors/response.interceptor'
import { CreateUserDto } from './dto/create.dto'
import { QueryDto } from './dto/queries.dto'
import { User } from './user.entity'
import { UserService } from './user.service'

@Controller('users')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Get(':id')
  async getUser(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<IGetOneResponse<User>> {
    const user = await this._userService.getOne(id)
    if (!user) throw new NotFoundException()
    return { data: user }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getUsers(
    @Query() { offset = 0, limit = 20, sort = 'username' }: QueryDto
  ): Promise<IGetListResponse<User>> {
    const [users, count] = await this._userService.getAll(limit, offset, sort)
    return { data: users, offset, count }
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() user: CreateUserDto
  ): Promise<IResponse> {
    const userExists = await this._userService.getOne(id)
    if (!userExists) throw new NotFoundException()
    await this._userService.update(id, user)
    return { message: 'Updated', id }
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async deleteUser(@Param('id', ParseUUIDPipe) id: string): Promise<IResponse> {
    await this._userService.delete(id)
    return { message: 'Deleted', id }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':userId/setRole/:roleId')
  async setRole(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('roleId', ParseUUIDPipe) roleId: string
  ): Promise<IResponse> {
    await this._userService.setRoleToUser(userId, roleId)
    return { message: 'Role added', id: userId }
  }
}
