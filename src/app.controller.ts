import { Controller, Get, UseInterceptors } from '@nestjs/common'
import { AppService } from './app.service'
import {
  ResponseInterceptor,
  Response
} from './interceptors/response.interceptor'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseInterceptors(ResponseInterceptor)
  getHello(): Response {
    const home = this.appService.getHello()
    return { message: home }
  }
}
