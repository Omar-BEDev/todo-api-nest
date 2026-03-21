import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignInDto } from "./dto/sign-in.dto";
import { SignUpDto } from "./dto/sign-up.dto";
import { Throttle } from "@nestjs/throttler";

@Throttle({
    default : {
        ttl : 60000,
        limit : 5
    }
})
@Controller("api/auth")
export class AuthController {
    constructor(private readonly authService : AuthService) {}
    @Post("/signin")
    @HttpCode(200)
    async signIn(@Body() body : SignInDto) {
        return await this.authService.signIn(body);
    }

    @Post("/signup")
    @HttpCode(201)
    async signUp(@Body() body : SignUpDto) {
        return await this.authService.signUp(body)
    }
}