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
  Query
} from '@nestjs/common'
import {
  Response,
  GetListResponse,
  GetOneResponse
} from '../../interceptors/response.interceptor'
import { CreateRoleDto } from './dto/create.dto'
import { Role } from './role.entity'
import { RoleService } from './role.service'

@Controller('roles')
export class RoleController {
  constructor(private readonly _roleService: RoleService) {}

  @Get(':id')
  async getRole(
    @Param('id', new ParseUUIDPipe()) id: string
  ): Promise<GetOneResponse<Role>> {
    const role = await this._roleService.getOne(id)
    if (!role) throw new NotFoundException()
    return { data: role }
  }

  @Get()
  async getRoles(
    @Query('limit') limit = 20,
    @Query('offset') offset = 0
  ): Promise<GetListResponse<Role[]>> {
    const [roles, count] = await this._roleService.getAll(limit, offset)
    return { data: roles, offset, count }
  }

  @Post()
  async createRole(@Body() role: CreateRoleDto): Promise<Response> {
    const created = await this._roleService.create(role)
    return { message: 'Created', id: created.id }
  }

  @Put(':id')
  async updateRole(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() role: CreateRoleDto
  ): Promise<Response> {
    const roleExists = await this._roleService.getOne(id)
    if (!roleExists) throw new NotFoundException()
    await this._roleService.update(id, role)
    return { message: 'Updated', id }
  }

  @Delete(':id')
  async deleteRole(
    @Param('id', new ParseUUIDPipe()) id: string
  ): Promise<Response> {
    const roleExists = await this._roleService.getOne(id)
    if (!roleExists) throw new NotFoundException()
    await this._roleService.delete(id)
    return { message: 'Deleted', id }
  }
}
