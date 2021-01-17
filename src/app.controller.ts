import { Controller, Get, UseInterceptors } from '@nestjs/common'
import { AppService } from './app.service'
import {
  ResponseInterceptor,
  IResponse
} from './interceptors/response.interceptor'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseInterceptors(ResponseInterceptor)
  getHello(): IResponse {
    const home = this.appService.getHello()
    return { message: home }
  }
}
