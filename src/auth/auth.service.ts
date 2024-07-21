import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/types/types';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private readonly jwtSrvice: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOne(email);
    if (user) {
      const passwordIsMatch = await argon2.verify(user.password, password);

      if (passwordIsMatch) {
        return user;
      }
    }
    throw new UnauthorizedException('User or password are incorrect');
  }

  async login(user: IUser) {
    const { id, email } = user;
    return {
      id,
      email,
      token: this.jwtSrvice.sign({ id: user.id, email: user.email }),
    };
  }
}
