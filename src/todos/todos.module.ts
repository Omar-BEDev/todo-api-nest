import { Module } from "@nestjs/common";
import { TodoService } from "./todos.service";
import { TodoController } from "./todos.controller";
import { PrismaService } from "src/utils/prisma";

@Module({
    providers : [
        TodoService,
        PrismaService
    ],
    controllers : [TodoController],

})

export class TodoModule{}