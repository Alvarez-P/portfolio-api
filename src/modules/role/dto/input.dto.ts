import { IsNotEmpty } from 'class-validator'
// import { Details } from '../../detail/details.entity'

export class CreateRoleDto {
  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  description: string

  @IsNotEmpty()
  password: string
}
