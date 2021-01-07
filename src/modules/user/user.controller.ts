import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put
} from '@nestjs/common'
import {
  Response,
  GetListResponse,
  GetOneResponse
} from '../../interceptors/response.interceptor'
import { InputUserDto } from './dto/input.dto'
import { User } from './user.entity'
import { UserService } from './user.service'

@Controller('users')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<GetOneResponse<User>> {
    const user = await this._userService.getOne(id)
    if (!user) throw new NotFoundException()
    return { data: user }
  }

  @Get()
  async getUsers(): Promise<GetListResponse<User[]>> {
    const users = await this._userService.getAll()
    return { data: users, page: 1, count: users.length }
  }

  @Post()
  async createUser(@Body() user: InputUserDto): Promise<Response> {
    const created = await this._userService.create(user)
    return { message: 'Created', id: created.id }
  }

  @Put(':id')
  async updateUser(
    @Param() id: string,
    @Body() user: InputUserDto
  ): Promise<Response> {
    const userExists = await this._userService.getOne(id)
    if (!userExists) throw new NotFoundException()
    await this._userService.update(id, user)
    return { message: 'Updated', id }
  }

  @Delete(':id')
  async deleteUser(@Param() id: string): Promise<Response> {
    const userExists = await this._userService.getOne(id)
    if (!userExists) throw new NotFoundException()
    await this._userService.delete(id)
    return { message: 'Deleted', id }
  }
}
