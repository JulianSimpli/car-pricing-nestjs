import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { promisify } from 'util';
import { randomBytes, scrypt as _scrypt } from 'crypto';

import { UsersService } from './users.service';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    //see if email is in use
    const users = await this.usersService.find(email);
    if (users.length) throw new BadRequestException('Email in use');
    //hash the user password
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = `${salt}.${hash.toString('hex')}`;
    //create a new user and save it
    const newUser = this.usersService.create(email, result);
    //return the user
    return newUser;
  }

  async sigin(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) throw new NotFoundException('User not found');
    const [userSalt, userHash] = user.password.split('.');
    const hash = (await scrypt(password, userSalt, 32)) as Buffer;
    if (userHash !== hash.toString('hex'))
      throw new BadRequestException('Wrong password');
    return user;
  }
}
