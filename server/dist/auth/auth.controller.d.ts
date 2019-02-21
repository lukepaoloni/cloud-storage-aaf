import { AuthService } from './auth.service';
import { Credentials } from './dto/credentials.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    getToken(credentials: Credentials): Promise<any>;
    verify(token: string): Promise<{}>;
    findAll(): {
        message: string;
    };
}
