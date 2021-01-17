import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UpdateResult } from 'typeorm'
import { RoleRepository } from '../role/role.repository'
import { CreateUserDto } from './dto/create.dto'
import { User } from './user.entity'
import { UserRepository } from './user.repository'
import { Keys } from 'src/config/config.keys'
import { ConfigService } from 'src/config/config.service'
import * as bcrypt from 'bcrypt'
import * as dotenv from 'dotenv'
dotenv.config()

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly _userRepository: UserRepository,
    @InjectRepository(RoleRepository)
    private readonly _roleRepository: RoleRepository,
    private readonly _configService: ConfigService
  ) {}

  getOne(id: string): Promise<User> {
    return this._userRepository.findOne(id, {
      where: { isActive: true }
    })
  }

  getAll(
    limit: number,
    offset: number,
    sort: string
  ): Promise<[User[], number]> {
    return this._userRepository
      .createQueryBuilder()
      .where('"isActive" = :isActive', { isActive: true })
      .orderBy(sort, 'ASC')
      .limit(limit)
      .offset(offset)
      .getManyAndCount()
  }

  async update(id: string, user: CreateUserDto): Promise<UpdateResult> {
    if (user.password)
      user.password = await bcrypt.hash(
        user.password,
        parseInt(this._configService.get(Keys.BCRYPT_HASH_ROUND))
      )
    return this._userRepository.update(id, user)
  }

  async delete(id: string): Promise<UpdateResult> {
    const userExists = await this._userRepository.findOne(id)
    if (!userExists) throw new NotFoundException()
    return this._userRepository.update(id, { isActive: false })
  }

  async setRoleToUser(userId: string, roleId: string): Promise<User> {
    const role = await this._roleRepository.findOne(roleId, {
      where: { isActive: true }
    })
    if (!role) throw new NotFoundException('Role does not exist')

    const user = await this._userRepository.findOne(userId, {
      where: { isActive: true }
    })
    if (!user) throw new NotFoundException('User not found')
    user.roles.push(role)

    return this._userRepository.save(user)
  }
}
