import { RoleType } from '../role/role.enum'

export interface IJwtPayload {
  id: string
  username: string
  email: string
  roles: RoleType[]
  iat?: Date
}
