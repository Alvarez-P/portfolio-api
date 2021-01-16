import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

export interface Response {
  message: string
  id?: string
}

export interface SigninResponse {
  access_token: string
}

export interface GetListResponse<T> {
  data: T
  offset: number
  count: number
}

export interface GetOneResponse<T> {
  data: T
}

@Injectable()
export class ResponseInterceptor<T>
  implements
    NestInterceptor<T, Response | GetOneResponse<T> | GetListResponse<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<Response | GetOneResponse<T> | GetListResponse<T>> {
    return next.handle().pipe(map((data) => data))
  }
}
