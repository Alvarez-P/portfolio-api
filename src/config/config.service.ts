import * as fs from 'fs'
import { parse } from 'dotenv'

export class ConfigService {
  private readonly envConfig: { [key: string]: string }

  constructor() {
    const { NODE_ENV } = process.env
    let envFileVersion = '.env'
    if (NODE_ENV === 'production') envFileVersion += '.production'
    else if (NODE_ENV === 'test') envFileVersion += '.test'

    const envFilePath = `${__dirname}/../../${envFileVersion}`
    const existsPath = fs.existsSync(envFilePath)
    if (!existsPath) {
      console.error(`${envFileVersion} file not exists`)
      process.exit(0)
    }
    const file = fs.readFileSync(envFilePath)
    this.envConfig = parse(file)
  }

  get(key: string): string {
    return this.envConfig[key]
  }
}
