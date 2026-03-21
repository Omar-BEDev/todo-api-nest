import { Module } from "@nestjs/common";
import { TodoModule } from "./todos/todos.module";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./users/users.module";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";


@Module({
    imports : [
        TodoModule,
        AuthModule,
        UserModule,
        ThrottlerModule.forRoot([
         {
            name : "default",
            ttl : 60000,
            limit : 100
            
         }
    ])
    ],
    providers : [
        {
            provide : APP_GUARD,
            useClass : ThrottlerGuard
        }
    ]
})

export class AppModule{}