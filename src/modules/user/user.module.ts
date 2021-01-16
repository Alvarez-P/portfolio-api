import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserRepository } from './user.repository'
import { RoleRepository } from '../role/role.repository'
import { ConfigService } from 'src/config/config.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository, RoleRepository]),
    ConfigService
  ],
  providers: [UserService, ConfigService],
  controllers: [UserController]
})
export class UserModule {}
