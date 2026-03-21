import { Module } from "@nestjs/common";
import { TodoService } from "./todos.service";
import { TodoController } from "./todos.controller";

@Module({
    providers : [TodoService],
    controllers : [TodoController]
})

export class TodoModule{}