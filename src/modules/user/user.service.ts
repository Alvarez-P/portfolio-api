import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { getConnection } from 'typeorm'
import { Role } from '../role/role.entity'
import { RoleRepository } from '../role/role.repository'
import { InputUserDto } from './dto/input.dto'
import { User } from './user.entity'
import { UserRepository } from './user.repository'
import * as bcrypt from 'bcrypt'
import * as dotenv from 'dotenv'
dotenv.config()

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly _userRepository: UserRepository,
    @InjectRepository(RoleRepository)
    private readonly _roleRepository: RoleRepository
  ) {}

  getOne(id: string): Promise<User> {
    return this._userRepository.findOne(id, {
      where: { isActive: true }
    })
  }

  getAll(): Promise<User[]> {
    return this._userRepository.find({
      where: { isActive: true }
    })
  }

  async create(user: InputUserDto): Promise<User> {
    const repository = await getConnection().getRepository(Role)
    const defaultRole = await repository.findOne({ where: { name: 'USER' } })
    user.password = await bcrypt.hash(
      user.password,
      parseInt(process.env.BCRYPT_HASH_ROUND)
    )
    return this._userRepository.save({
      ...user,
      roles: [defaultRole]
    })
  }

  async update(id: string, user: InputUserDto): Promise<void> {
    if (user.password)
      user.password = await bcrypt.hash(
        user.password,
        parseInt(process.env.BCRYPT_HASH_ROUND)
      )
    await this._userRepository.update(id, user)
  }

  async delete(id: string): Promise<void> {
    await this._userRepository.update(id, { isActive: false })
  }

  async setRoleToUser(user: User, roleId: string): Promise<void> {
    const roleExist = await this._roleRepository.findOne(roleId, {
      where: { isActive: true }
    })
    if (!roleExist) {
      throw new NotFoundException('Role does not exist')
    }
    user.roles.push(roleExist)
    await this._userRepository.save(user)
  }
}