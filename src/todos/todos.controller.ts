import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { TodoService } from "./todos.service";
import { CreateTodoDto } from "./dto/create-todo.dto";
import { UpdateTodoDto } from "./dto/update-todo.dto";

@Controller("api/todo")
export class TodoController {
    constructor(private readonly todoService : TodoService) {}
    @Post()
    async createTask(
        @Param() userId : string,
        @Body() body : CreateTodoDto
    ) {
        return await this.todoService.createTodo(body, userId)
    }
    @Put()
    async updateTask(
        @Param() userId : string,
        @Body() body : UpdateTodoDto
    ) {
        return await this.todoService.updateTodo(body, userId)
    }
    @Get()
    async getTodos(
        @Param() userId : string
    ) {
        return await this.todoService.getTodos(userId)
    }
}
