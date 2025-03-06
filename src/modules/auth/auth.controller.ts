import {
  Controller,
  Post,
  Body,
  HttpStatus,
  Res,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { ResponseRegisterDto } from './dto/response-register.dto';
import { ApiOperation, ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';
import { LogInDto } from './dto/log-in.dto';
import { RequestOrigin } from '../../decorators/request-origin.decorator';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RequestUser } from '../../decorators/request-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('인증')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: '회원가입',
    description: '회원가입을 진행합니다.',
  })
  @ApiResponse({
    type: ResponseRegisterDto,
    status: HttpStatus.CREATED,
    description: '회원가입 성공',
  })
  @ApiBody({ type: RegisterDto })
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<ResponseRegisterDto> {
    return await this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({
    summary: '로그인',
    description: '로그인을 진행합니다.',
  })
  @ApiBody({ type: LogInDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '로그인 성공',
  })
  async logIn(
    @Body() logInDto: LogInDto,
    @RequestOrigin() requestOrigin: string,
    @Res() res: Response,
  ) {
    const { accessToken, refreshToken, accessOptions, refreshOptions } =
      await this.authService.logIn(logInDto, requestOrigin);

    res.cookie('Authentication', accessToken, accessOptions);
    res.cookie('Refresh', refreshToken, refreshOptions);

    return res.json({
      message: '로그인 성공',
      accessToken,
      refreshToken,
    });
  }

  @Post('logout')
  @ApiOperation({
    summary: '로그아웃',
    description: '로그아웃을 진행합니다.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '로그아웃 성공',
  })
  logout(@Res() res: Response, @RequestOrigin() requestOrigin: string) {
    const { accessOptions, refreshOptions } =
      this.authService.expireJwtToken(requestOrigin);
    res.clearCookie('Authentication', accessOptions);
    res.clearCookie('Refresh', refreshOptions);
    return res.json({
      message: '로그아웃 성공',
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload-profile')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: '프로필 이미지 업로드',
    description: '프로필 이미지를 업로드합니다.',
  })
  async uploadProfile(
    @UploadedFile() file: Express.Multer.File,
    @RequestUser() user: User,
  ) {
    return {
      url: await this.authService.uploadProfile(file),
    };
  }
}
