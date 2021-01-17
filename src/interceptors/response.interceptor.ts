import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

export interface IResponse {
  message: string
  id?: string
}

export interface ISigninResponse {
  access_token: string
}

export interface IGetListResponse<T> {
  data: T[]
  offset: number
  count: number
}

export interface IGetOneResponse<T> {
  data: T
}

@Injectable()
export class ResponseInterceptor<T>
  implements
    NestInterceptor<T, IResponse | IGetOneResponse<T> | IGetListResponse<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<IResponse | IGetOneResponse<T> | IGetListResponse<T>> {
    return next.handle().pipe(map((data) => data))
  }
}
