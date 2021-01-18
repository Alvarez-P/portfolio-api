import { RoleGuard } from '../guard/role.guard'

describe('RoleGuard', () => {
  it('should be defined', () => {
    expect(new RoleGuard()).toBeDefined()
  })
})
