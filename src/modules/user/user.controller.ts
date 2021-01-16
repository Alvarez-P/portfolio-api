import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Put,
  Query
} from '@nestjs/common'
import {
  Response,
  GetListResponse,
  GetOneResponse
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
    @Param('id', new ParseUUIDPipe()) id: string
  ): Promise<GetOneResponse<User>> {
    const user = await this._userService.getOne(id)
    if (!user) throw new NotFoundException()
    return { data: user }
  }

  @Get()
  async getUsers(
    @Query() { offset = 0, limit = 20, sort = 'username' }: QueryDto
  ): Promise<GetListResponse<User[]>> {
    const [users, count] = await this._userService.getAll(limit, offset, sort)
    return { data: users, offset, count }
  }

  @Put(':id')
  async updateUser(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() user: CreateUserDto
  ): Promise<Response> {
    const userExists = await this._userService.getOne(id)
    if (!userExists) throw new NotFoundException()
    await this._userService.update(id, user)
    return { message: 'Updated', id }
  }

  @Delete(':id')
  async deleteUser(
    @Param('id', new ParseUUIDPipe()) id: string
  ): Promise<Response> {
    const userExists = await this._userService.getOne(id)
    if (!userExists) throw new NotFoundException()
    await this._userService.delete(id)
    return { message: 'Deleted', id }
  }
}
