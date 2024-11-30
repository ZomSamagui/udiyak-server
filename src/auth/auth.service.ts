import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, nickname, password } = registerDto;

    if (!email || !nickname || !password) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: '회원가입 실패',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // 이메일 중복 검사
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: '이미 등록된 이메일입니다.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      email,
      nickname,
      password: hashedPassword,
    });
    await this.userRepository.save(user);

    return {
      status: HttpStatus.OK,
      message: '회원가입 성공',
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: '로그인 실패',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d', // Refresh Token 만료 시간
    });

    return {
      status: HttpStatus.OK,
      message: '로그인 성공',
      data: { accessToken: accessToken, refreshToken: refreshToken },
    };
  }

  async reissue(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken); // RefreshToken 검증

      // RefreshToken이 유효하다면 새로운 AccessToken 발급
      const newAccessToken = this.jwtService.sign({
        email: payload.email,
        sub: payload.sub,
      });

      return {
        status: HttpStatus.OK,
        message: '토큰 재발급 성공',
        data: { accessToken: newAccessToken },
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          message: '만료된 토큰',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
