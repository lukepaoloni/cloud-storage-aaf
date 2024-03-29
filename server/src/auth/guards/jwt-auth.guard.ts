import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import * as jwt from 'jsonwebtoken'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = context.switchToHttp()
        const request = ctx.getRequest()
        const token = request.headers.authorization
        if (!token) {
            return false
        }
        request.user = await this.validateToken(token)

        return true
    }

    async validateToken(token: string) {
        if (token.split(' ')[0] !== 'Bearer') {
            throw new UnauthorizedException('Invalid token')
        }
        const bearerToken = token.split(' ')[1]
        try {
            const decoded = jwt.verify(bearerToken, process.env.APP_SECRET)
            return decoded
        } catch (err) {
            const message = `Token error: ${err.message || err.name}`
            throw new UnauthorizedException(message)
        }
    }

    handleRequest(err, user, info) {
        if (err || !user) {
            throw err || new UnauthorizedException()
        }

        return user
    }
}
