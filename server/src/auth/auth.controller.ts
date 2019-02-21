import { Controller, Get, UseGuards, Body, Headers } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthGuard } from '@nestjs/passport'
import { Credentials } from './dto/credentials.dto'

@Controller('api/rest/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Get('token')
    public async getToken(@Body() credentials: Credentials): Promise<any> {
        return await this.authService.createToken(credentials)
    }

    @Get('verify')
    @UseGuards(AuthGuard())
    public async verify(@Headers('Authorization') token: string) {
        return this.authService.verifyToken(token)
    }

    @Get('data')
    @UseGuards(AuthGuard())
    public findAll() {
        return {
            message: 'This route is restricted by AuthGuard',
        }
    }
}
