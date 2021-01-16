import { IsOptional, IsNumberString, IsEnum } from 'class-validator'

enum ESort {
  username = 'username',
  email = 'email',
  role = 'role'
}

export class QueryDto {
  @IsOptional()
  @IsNumberString()
  limit: number

  @IsOptional()
  @IsNumberString()
  offset: number

  @IsOptional()
  @IsEnum(ESort, { each: true })
  sort: string
}
