import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm'; // Added MoreThan for expiration check
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { User } from '../user/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async register(dto: RegisterDto) {
    const { fullName, email, password, role } = dto;

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Email is already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      fullName,
      email,
      password: hashedPassword,
      role,
    });

    await this.userRepository.save(user);

    this.mailService
      .sendWelcomeEmail(user.email, user.fullName)
      .catch((err) => {
        console.error('Failed to send welcome email:', err);
      });

    const { password: _, ...result } = user;

    return {
      message: 'User registered successfully',
      data: result,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, role: user.role, fullName: user.fullName };

    return {
      message: 'Login successful',
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async forgotPassword(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    
    // Security best practice: Don't tell hackers if an email exists or not
    if (!user) {
      return { message: 'If that email exists in our system, a reset link has been sent.' };
    }

    // Generate a secure 64-character token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Save token and set expiration to 1 hour from now
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); 
    await this.userRepository.save(user);

    // Send the email with the frontend link
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
    
    // Using the new mail service method
    this.mailService.sendPasswordResetEmail(user.email, user.fullName || 'Customer', resetLink)
      .catch((err) => {
        console.error('Failed to send reset password email:', err);
      });

    return { message: 'If that email exists in our system, a reset link has been sent.' };
  }

  async resetPassword(token: string, newPassword: string) {
    // Find the user with this exact token AND make sure it hasn't expired
    const user = await this.userRepository.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: MoreThan(new Date()),
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid or expired password reset token.');
    }

    // Hash the new password, save it, and destroy the temporary token
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await this.userRepository.save(user);

    return { message: 'Password has been successfully reset!' };
  }
}