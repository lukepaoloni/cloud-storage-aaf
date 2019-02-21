import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { JwtPayload } from './interfaces/jwt-payload.interface'
import { UserService } from '../user/user.service'
import { Credentials } from './dto/credentials.dto'

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
    ) {}

    public async createToken(credentials: Credentials) {
        const user = await this.userService.login(credentials)
        const accessToken = this.jwtService.sign(user)
        return {
            expiresIn: 3600,
            accessToken,
        }
    }

    public async verifyToken(token: string) {
        return new Promise(resolve => {
            this.jwtService.verify(token)
        })
    }

    public async validateUser(payload: JwtPayload): Promise<any> {
        return await this.userService.findByEmail(payload.email)
    }
}
