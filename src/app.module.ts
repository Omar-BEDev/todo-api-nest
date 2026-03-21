import { Module } from "@nestjs/common";
import { TodoModule } from "./todos/todos.module";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./users/users.module";


@Module({
    imports : [
        TodoModule,
        AuthModule,
        UserModule
    ]
})

export class AppModule{}