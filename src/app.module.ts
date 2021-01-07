import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from './config/config.module'
import { UserModule } from './modules/user/user.module'
import { Keys } from './config/config.keys'
import { ConfigService } from './config/config.service'
import { RoleModule } from './modules/role/role.module'
import { DatabaseModule } from './database/database.module'

@Module({
  imports: [ConfigModule, UserModule, RoleModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
  static PORT: number | string
  constructor(private readonly _configService: ConfigService) {
    AppModule.PORT = this._configService.get(Keys.SERVER_PORT)
  }
}
