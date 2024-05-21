import { Repository } from 'typeorm';
import { LoginAuthDto } from './dtos/login.dto';
import { User } from '@app/database-type-orm/entities/User.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Exception } from '@app/core/exception';
import { ErrorCode } from '@app/core/constants/enum';
import * as bcrypt from 'bcrypt';
import { JwtAuthenticationService } from '@app/jwt-authentication';
import { ChangePasswordDto } from './dtos/changePassword.dto';
import { ForgetPasswordDto } from './dtos/forgetPassword.dto';
import { SendgridService } from '@app/sendgrid';
import { ResetPasswordDto } from './dtos/resetPassword.dto';

export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtAuthService: JwtAuthenticationService,
    private sendGridService: SendgridService,
  ) {}

  public async login(loginDto: LoginAuthDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: loginDto.email,
      },
      select: ['id', 'email', 'password'],
    });
    if (!user) {
      throw new Exception(ErrorCode.Email_Not_Valid);
    }
    if (!bcrypt.compareSync(loginDto.password, user.password)) {
      throw new Exception(ErrorCode.Password_Not_Valid);
    }
    console.log(user);
    return this.generateTokensAndSave(user);
  }

  async changePassword(userId: number, changeDto: ChangePasswordDto) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      select: ['email', 'password'],
    });
    if (!user) {
      throw new Exception(ErrorCode.User_Not_Found);
    }
    if (!bcrypt.compareSync(changeDto.oldPassword, user.password)) {
      throw new Exception(ErrorCode.Password_Not_Valid);
    }
    const hashedPassword = await bcrypt.hash(
      changeDto.newPassword,
      parseInt(process.env.BCRYPT_HASH_ROUND),
    );
    await this.userRepository.update(userId, { password: hashedPassword });
    return {
      message: 'Reset Password Successfully',
    };
  }

  async forgetPassword(forgetDto: ForgetPasswordDto) {
    //check if user existed
    const user = await this.userRepository.findOne({
      where: {
        email: forgetDto.email,
      },
    });
    if (!user) {
      throw new Exception(ErrorCode.User_Not_Found, 'User Not Found');
    }
    const resetLink = `http://localhost:3000/reset-password?resetToken=${user.resetToken}`;

    await this.sendGridService.sendMail(
      user.email,
      'Reset Password Request',
      'reset-password',
      'reset-password',
      `<p>You requested a password reset. Click the link below to reset your password:</p>
    <p><a href="${resetLink}">Reset Password</a></p>`,
    );

    return {
      message: 'Check your email',
    };
  }

  async resetPassword(resetToken, resetDto: ResetPasswordDto) {
    const user = await this.userRepository.findOne({
      where: {
        resetToken: resetToken,
      },
    });
    if (!user) {
      throw new Exception(ErrorCode.User_Not_Found);
    }
    const hashedPassword = await bcrypt.hash(
      resetDto.password,
      parseInt(process.env.BCRYPT_HASH_ROUND),
    );
    const resetTokenNew = this.generateRandomResetToken();
    await this.userRepository.update(user.id, {
      password: hashedPassword,
      resetToken: resetTokenNew,
    });
    return {
      message: 'Reset Password Successfully',
    };
  }

  public async refreshTokens(refreshToken: string) {
    const user = this.jwtAuthService.verifyRefreshToken(refreshToken);
    if (!user) {
      throw new Exception(ErrorCode.User_Not_Found);
    }
    const newRefreshToken = this.jwtAuthService.generateRefreshToken({
      id: user.id,
      email: user.email,
      resetToken: user.resetToken,
    });
    await this.userRepository.update(user.id, { refreshToken });
    return { refreshToken: newRefreshToken };
  }

  private async generateTokensAndSave(user: User) {
    const accessToken = this.jwtAuthService.generateAccessToken({
      id: user.id,
      email: user.email,
    });
    const refreshToken = this.jwtAuthService.generateRefreshToken({
      id: user.id,
      email: user.email,
    });

    await this.userRepository.update(user.id, {
      refreshToken,
    });
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  private generateRandomResetToken() {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    const length = 100;

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      token += characters.charAt(randomIndex);
    }
    return token;
  }
}