import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LogInDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: '이메일',
    example: 'test@test.com',
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    description: '비밀번호',
    example: '!Password123',
  })
  password: string;
}
