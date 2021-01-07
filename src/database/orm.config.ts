import { ConnectionOptions } from 'typeorm'
import * as dotenv from 'dotenv'
dotenv.config()

const config: ConnectionOptions = {
  type: 'postgres',
  synchronize: true,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  cli: {
    migrationsDir: '/src/database/migrations'
  }
}

export = config
