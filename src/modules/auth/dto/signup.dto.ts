import { IsNotEmpty, IsEmail, Length, Matches } from 'class-validator'
// import { Details } from '../../detail/details.entity'

export class SignupDto {
  @IsNotEmpty()
  @Length(10, 20)
  username: string

  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @Length(8, 20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak'
  })
  password: string

  //   @IsNotEmpty()
  //   details: Details
}
