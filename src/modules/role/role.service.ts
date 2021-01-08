import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UpdateResult } from 'typeorm'
import { CreateRoleDto } from './dto/create.dto'
import { Role } from './role.entity'
import { RoleRepository } from './role.repository'

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleRepository)
    private readonly _roleRepository: RoleRepository
  ) {}

  getOne(id: string): Promise<Role> {
    return this._roleRepository.findOne(id, {
      where: { isActive: true }
    })
  }

  getAll(limit: number, offset: number): Promise<[Role[], number]> {
    return this._roleRepository.findAndCount({
      where: { isActive: true },
      order: { name: 'DESC' },
      take: limit,
      skip: offset
    })
  }

  create(role: CreateRoleDto): Promise<Role> {
    return this._roleRepository.save(role)
  }

  update(id: string, role: CreateRoleDto): Promise<UpdateResult> {
    return this._roleRepository.update(id, role)
  }

  delete(id: string): Promise<UpdateResult> {
    return this._roleRepository.update(id, { isActive: false })
  }
}
