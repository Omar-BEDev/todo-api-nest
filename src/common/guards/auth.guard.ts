import {
    CanActivate,
     ExecutionContext, 
     UnauthorizedException
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";


export class AuthGuard implements CanActivate {
    constructor(private readonly jwtService : JwtService) {}
    
    async canActivate(ctx : ExecutionContext) : Promise<boolean>{


        const req = ctx.switchToHttp().getRequest()
        const header = req.headers['authorization']


        if (!header) {
            throw new UnauthorizedException("Unauthorized")
        }
        const token = header.split(' ')[1]


        if (!token) {
            throw new UnauthorizedException("Unautorized")
        }

        const decode = await this.jwtService.verifyAsync(token)
        .catch(() =>{
            throw new UnauthorizedException("The user Unauthorized")
            
        })

        req.user = decode
        return true 
    }
}