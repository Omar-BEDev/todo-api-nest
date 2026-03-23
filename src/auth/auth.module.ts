import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PrismaService } from "../utils/prisma";


@Module({
    providers : [
        AuthService,
        PrismaService
    ],
    controllers : [AuthController],
    imports : [
        JwtModule.register({
            global : true,
            secret : process.env.JWT_SECRET,
            signOptions : {
                expiresIn : "1h"
            }
        })
    ],
    exports : [JwtModule]
})

export class AuthModule{}