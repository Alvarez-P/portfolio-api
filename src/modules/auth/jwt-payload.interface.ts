import { ERoleType } from '../role/role.enum'

export interface IJwtPayload {
  id: string
  username: string
  email: string
  roles: ERoleType[]
  iat?: Date
}
