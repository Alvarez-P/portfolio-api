import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { compare } from 'bcrypt'
import { ISigninResponse } from 'src/interceptors/response.interceptor'
import { ERoleType } from '../role/role.enum'
import { User } from '../user/user.entity'
import { AuthRepository } from './auth.repository'
import { SigninDto, SignupDto } from './dto'
import { IJwtPayload } from './jwt-payload.interface'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthRepository)
    private readonly _authRepository: AuthRepository,
    private readonly _jwtService: JwtService
  ) {}

  async signup(signupDto: SignupDto): Promise<User> {
    const { username, email } = signupDto
    const userExists = await this._authRepository.findOne({
      where: [{ username }, { email }]
    })

    if (userExists)
      throw new ConflictException('Username or email already exists')
    return this._authRepository.signup(signupDto)
  }

  async signin(signinDto: SigninDto): Promise<ISigninResponse> {
    const { username, password } = signinDto
    const user = await this._authRepository.findOne({
      relations: ['roles'],
      select: ['id', 'password', 'email', 'username'],
      where: { username }
    })
    if (!user) throw new NotFoundException('User does not exists')
    const isMatch = await compare(password, user.password)
    if (!isMatch) throw new UnauthorizedException('Invalid password')
    const payload: IJwtPayload = {
      id: user.id,
      email: user.email,
      username: user.username,
      roles: user.roles.map((role) => role.name as ERoleType)
    }
    return { access_token: this._jwtService.sign(payload) }
  }
}
