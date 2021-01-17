import { Body, Controller, Post } from '@nestjs/common'
import {
  IResponse,
  ISigninResponse
} from 'src/interceptors/response.interceptor'
import { AuthService } from './auth.service'
import { SigninDto, SignupDto } from './dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto): Promise<IResponse> {
    const user = await this._authService.signup(signupDto)
    return { message: 'Signup', id: user.id }
  }

  @Post('signin')
  signin(@Body() signinDto: SigninDto): Promise<ISigninResponse> {
    return this._authService.signin(signinDto)
  }
}
