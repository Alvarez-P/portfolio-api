import { EntityRepository, getConnection, Repository } from 'typeorm'
import { Role } from '../role/role.entity'
import { User } from '../user/user.entity'
import { SignupDto } from './dto'
import * as bcrypt from 'bcrypt'
import * as dotenv from 'dotenv'
import { Keys } from 'src/config/config.keys'
dotenv.config()

@EntityRepository(User)
export class AuthRepository extends Repository<User> {
  async signup(signup: SignupDto): Promise<User> {
    const userRepository = await getConnection().getRepository(User)
    const roleRepository = await getConnection().getRepository(Role)
    const defaultRole = await roleRepository.findOne({
      where: { name: 'USER' }
    })

    signup.password = await bcrypt.hash(
      signup.password,
      parseInt(process.env[Keys.BCRYPT_HASH_ROUND])
    )
    return userRepository.save({
      ...signup,
      roles: [defaultRole]
    })
  }
}
