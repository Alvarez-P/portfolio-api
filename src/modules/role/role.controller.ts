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
import { Roles } from './decorator/role.decorator'
import { CreateRoleDto } from './dto/create.dto'
import { RoleGuard } from './guard/role.guard'
import { Role } from './role.entity'
import { ERoleType } from './role.enum'
import { RoleService } from './role.service'

@Controller('roles')
export class RoleController {
  constructor(private readonly _roleService: RoleService) {}

  @Roles(ERoleType.ADMIN)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Get(':id')
  async getRole(
    @Param('id', new ParseUUIDPipe()) id: string
  ): Promise<IGetOneResponse<Role>> {
    const role = await this._roleService.getOne(id)
    if (!role) throw new NotFoundException()
    return { data: role }
  }

  @Roles(ERoleType.ADMIN)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Get()
  async getRoles(
    @Query('limit') limit = 20,
    @Query('offset') offset = 0
  ): Promise<IGetListResponse<Role>> {
    const [roles, count] = await this._roleService.getAll(limit, offset)
    return { data: roles, offset, count }
  }

  @Roles(ERoleType.ADMIN)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Post()
  async createRole(@Body() role: CreateRoleDto): Promise<IResponse> {
    const created = await this._roleService.create(role)
    return { message: 'Created', id: created.id }
  }

  @Roles(ERoleType.ADMIN)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Put(':id')
  async updateRole(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() role: CreateRoleDto
  ): Promise<IResponse> {
    const roleExists = await this._roleService.getOne(id)
    if (!roleExists) throw new NotFoundException()
    await this._roleService.update(id, role)
    return { message: 'Updated', id }
  }

  @Roles(ERoleType.ADMIN)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Delete(':id')
  async deleteRole(
    @Param('id', new ParseUUIDPipe()) id: string
  ): Promise<IResponse> {
    const roleExists = await this._roleService.getOne(id)
    if (!roleExists) throw new NotFoundException()
    await this._roleService.delete(id)
    return { message: 'Deleted', id }
  }
}
