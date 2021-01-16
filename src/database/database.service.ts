import { TypeOrmModule } from '@nestjs/typeorm'
import { Keys } from '../config/config.keys'
import { ConfigModule } from '../config/config.module'
import { ConfigService } from '../config/config.service'
import { ConnectionOptions } from 'typeorm'

export const databaseProviders = [
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    async useFactory(config: ConfigService) {
      return {
        ssl: config.get(Keys.DB_HOST) === `true`,
        type: 'postgres',
        host: config.get(Keys.DB_HOST),
        port: parseInt(config.get(Keys.DB_PORT)),
        username: config.get(Keys.DB_USER),
        password: config.get(Keys.DB_PASSWORD),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        database: config.get(Keys.DB_NAME)
      } as ConnectionOptions
    }
  })
]
